import {
  BudgetBand,
  Listing,
  MatchResult,
  PreferenceVector,
  QuizAnswers,
} from '../types';

export function getPriceBand(priceAED: number): BudgetBand {
  if (priceAED < 1_000_000) return 'under_1m';
  if (priceAED <= 2_000_000) return '1m_to_2m';
  return 'over_2m';
}

export function scoreListing(
  listing: Listing,
  quiz: QuizAnswers,
  preferenceVector: PreferenceVector
): MatchResult {
  const factorScores: { label: string; points: number; max: number }[] = [];

  // 1. Budget fit (30 pts)
  let budgetPts = 18;
  if (quiz.budgetBand) {
    const band = getPriceBand(listing.priceAED);
    if (band === quiz.budgetBand) {
      budgetPts = 30;
    } else if (
      (quiz.budgetBand === 'under_1m' && listing.priceAED <= 1_200_000) ||
      (quiz.budgetBand === '1m_to_2m' &&
        (listing.priceAED >= 850_000 && listing.priceAED <= 2_250_000)) ||
      (quiz.budgetBand === 'over_2m' && listing.priceAED >= 1_750_000)
    ) {
      budgetPts = 17;
    } else {
      budgetPts = 4;
    }
  }
  factorScores.push({ label: 'Within budget', points: budgetPts, max: 30 });

  // 2. Area preference (20 pts)
  let areaPts = 12;
  if (quiz.openToAnywhere || quiz.preferredAreas.length === 0) {
    areaPts = 17;
  } else if (quiz.preferredAreas.includes(listing.area)) {
    areaPts = 20;
  } else {
    areaPts = 5;
  }
  factorScores.push({
    label: `In ${listing.area}`,
    points: areaPts,
    max: 20,
  });

  // 3. Commute within max (15 pts)
  const maxCommute = quiz.maxCommute ?? 25;
  let commutePts = 10;
  if (listing.commuteMinutes <= maxCommute) {
    commutePts = 15;
  } else if (listing.commuteMinutes <= maxCommute + 7) {
    commutePts = 8;
  } else {
    commutePts = 2;
  }
  factorScores.push({
    label: `${listing.commuteMinutes} min commute`,
    points: commutePts,
    max: 15,
  });

  // 4. Must-be-near amenities (15 pts)
  let amenityPts = 12;
  let amenityReason = 'Quiet neighbourhood';
  if (quiz.mustBeNear.length > 0) {
    const matched = quiz.mustBeNear.filter((a) => listing.nearby.includes(a));
    amenityPts = Math.round((matched.length / quiz.mustBeNear.length) * 15);
    if (matched.length > 0) {
      amenityReason = `Near ${matched[0].toLowerCase()}`;
    }
  } else if (listing.nearby.length > 0) {
    amenityPts = 14;
    amenityReason = `Near ${listing.nearby[0].toLowerCase()}`;
  }
  factorScores.push({
    label: amenityReason,
    points: amenityPts,
    max: 15,
  });

  // 5. Bedrooms & family needs (10 pts)
  let bedPts = 7;
  if (quiz.bedrooms && quiz.bedrooms.length > 0) {
    const bedKey = listing.beds >= 3 ? 3 : listing.beds;
    if (quiz.bedrooms.includes(bedKey)) {
      bedPts = 10;
    } else if (
      quiz.bedrooms.some((b) => Math.abs(b - bedKey) === 1)
    ) {
      bedPts = 5;
    } else {
      bedPts = 1;
    }
  }
  if (quiz.familyWithKids && listing.beds >= 2 && listing.nearby.includes('School')) {
    bedPts = Math.min(10, bedPts + 2);
  }
  factorScores.push({
    label: listing.beds === 0 ? 'Smart studio fit' : `${listing.beds}-bed layout`,
    points: bedPts,
    max: 10,
  });

  // 6. Goal / ROI fit (10 pts)
  let goalPts = 7;
  let goalLabel = `${listing.roiPercent.toFixed(1)}% ROI`;
  if (quiz.goal === 'invest') {
    goalPts = listing.roiPercent >= 7.0 ? 10 : listing.roiPercent >= 6.0 ? 7 : 3;
    goalLabel = `Strong ${listing.roiPercent.toFixed(1)}% ROI`;
  } else if (quiz.goal === 'both') {
    goalPts = listing.roiPercent >= 6.5 ? 10 : listing.roiPercent >= 5.5 ? 7 : 4;
    goalLabel = `Balanced ${listing.roiPercent.toFixed(1)}% ROI`;
  } else if (quiz.goal === 'live') {
    goalPts = listing.commuteMinutes <= 18 ? 10 : 7;
    goalLabel = 'Great livability';
  }
  factorScores.push({ label: goalLabel, points: goalPts, max: 10 });

  const quizScore =
    budgetPts + areaPts + commutePts + amenityPts + bedPts + goalPts;

  // 7. Swipe learning vector (+/- 15 max)
  const band = getPriceBand(listing.priceAED);
  const bedKey = listing.beds >= 3 ? 3 : listing.beds;
  let learningDelta = 0;

  learningDelta += (preferenceVector.areaBias[listing.area] ?? 0) * 3.5;
  learningDelta += (preferenceVector.bedBias[bedKey] ?? 0) * 2.5;
  learningDelta += (preferenceVector.priceBandBias[band] ?? 0) * 3;
  for (const amenity of listing.nearby) {
    learningDelta += (preferenceVector.amenityBias[amenity] ?? 0) * 2;
  }
  if (listing.roiPercent >= 6.8) {
    learningDelta += preferenceVector.roiWeight * 2;
  }
  if (listing.commuteMinutes <= 16) {
    learningDelta += preferenceVector.commuteWeight * 2;
  }

  const clampedDelta = Math.max(-15, Math.min(15, learningDelta));
  const rawTotal = Math.round(quizScore + clampedDelta);
  const finalScore = Math.max(40, Math.min(99, rawTotal));

  // Top 2 contributing reasons sorted by percentage of max achieved
  const topReasons = [...factorScores]
    .sort((a, b) => b.points / b.max - a.points / a.max)
    .slice(0, 2)
    .map((f) => f.label);

  return {
    listing,
    score: finalScore,
    reasons: topReasons,
  };
}

export function updatePreferenceVector(
  prev: PreferenceVector,
  listing: Listing,
  direction: 'left' | 'right'
): PreferenceVector {
  const signal = direction === 'right' ? 1 : -0.75;
  const decay = 0.92;
  const band = getPriceBand(listing.priceAED);
  const bedKey = listing.beds >= 3 ? 3 : listing.beds;

  const nextAreaBias: Record<string, number> = {};
  for (const [k, v] of Object.entries(prev.areaBias)) {
    nextAreaBias[k] = Number((v * decay).toFixed(3));
  }
  nextAreaBias[listing.area] = Number(
    Math.max(-3, Math.min(3, (nextAreaBias[listing.area] ?? 0) + signal)).toFixed(3)
  );

  const nextBedBias: Record<number, number> = {};
  for (const [k, v] of Object.entries(prev.bedBias)) {
    nextBedBias[Number(k)] = Number((v * decay).toFixed(3));
  }
  nextBedBias[bedKey] = Number(
    Math.max(-3, Math.min(3, (nextBedBias[bedKey] ?? 0) + signal)).toFixed(3)
  );

  const nextPriceBias = {
    under_1m: Number((prev.priceBandBias.under_1m * decay).toFixed(3)),
    '1m_to_2m': Number((prev.priceBandBias['1m_to_2m'] * decay).toFixed(3)),
    over_2m: Number((prev.priceBandBias.over_2m * decay).toFixed(3)),
  };
  nextPriceBias[band] = Number(
    Math.max(-3, Math.min(3, nextPriceBias[band] + signal)).toFixed(3)
  );

  const nextAmenityBias = {
    Metro: Number((prev.amenityBias.Metro * decay).toFixed(3)),
    School: Number((prev.amenityBias.School * decay).toFixed(3)),
    Mosque: Number((prev.amenityBias.Mosque * decay).toFixed(3)),
  };
  for (const amenity of listing.nearby) {
    nextAmenityBias[amenity] = Number(
      Math.max(-3, Math.min(3, nextAmenityBias[amenity] + signal * 0.8)).toFixed(3)
    );
  }

  let roiWeight = prev.roiWeight * decay;
  if (listing.roiPercent >= 6.8) {
    roiWeight += signal * 0.7;
  }

  let commuteWeight = prev.commuteWeight * decay;
  if (listing.commuteMinutes <= 16) {
    commuteWeight += signal * 0.7;
  }

  return {
    areaBias: nextAreaBias,
    bedBias: nextBedBias,
    priceBandBias: nextPriceBias,
    amenityBias: nextAmenityBias,
    roiWeight: Number(Math.max(-3, Math.min(3, roiWeight)).toFixed(3)),
    commuteWeight: Number(Math.max(-3, Math.min(3, commuteWeight)).toFixed(3)),
    totalSwipes: prev.totalSwipes + 1,
  };
}

export function getLearningInsightToast(
  vector: PreferenceVector
): string | null {
  const bestArea = Object.entries(vector.areaBias).sort((a, b) => b[1] - a[1])[0];
  const bestAmenity = Object.entries(vector.amenityBias).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const areaPhrase =
    bestArea && bestArea[1] > 0.4 ? bestArea[0] : 'central Dubai';
  const amenityPhrase =
    bestAmenity && bestAmenity[1] > 0.3
      ? `${bestAmenity[0]}-close homes`
      : vector.roiWeight > 0.4
      ? 'high-ROI homes'
      : 'short-commute homes';

  return `iFinder is learning: you favour ${areaPhrase} and ${amenityPhrase}`;
}

export function rankListings(
  listings: Listing[],
  quiz: QuizAnswers,
  preferenceVector: PreferenceVector
): MatchResult[] {
  return listings
    .map((listing) => scoreListing(listing, quiz, preferenceVector))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.listing.verified !== b.listing.verified) {
        return a.listing.verified ? -1 : 1;
      }
      return a.listing.id.localeCompare(b.listing.id, undefined, { numeric: true });
    });
}

export async function rankListingsAsync(
  listings: Listing[],
  quiz: QuizAnswers,
  preferenceVector: PreferenceVector
): Promise<MatchResult[]> {
  return Promise.resolve(rankListings(listings, quiz, preferenceVector));
}
