import test from 'node:test';
import assert from 'node:assert/strict';
import { SEED_LISTINGS } from '../data/listings';
import { SARA_QUIZ_PRESET } from '../data/copy';
import { INITIAL_PREFERENCE_VECTOR } from '../data/seed';
import {
  getLearningInsightToast,
  rankListings,
  scoreListing,
  updatePreferenceVector,
} from './matchingService';
import { validateReraBrn } from './agentService';
import { validateDldPermit } from './listingService';

test('scoreListing always clamps scores between 40 and 99', () => {
  for (const listing of SEED_LISTINGS) {
    const res = scoreListing(listing, SARA_QUIZ_PRESET, INITIAL_PREFERENCE_VECTOR);
    assert.ok(res.score >= 40 && res.score <= 99, `Score ${res.score} out of bounds`);
    assert.equal(Number.isInteger(res.score), true);
    assert.equal(res.reasons.length, 2);
  }
});

test('Sara preset scores JVC 1-bed (#1) and JLT 2-bed (#3) higher than Palm 3-bed (#18)', () => {
  const jvc = SEED_LISTINGS.find((l) => l.id === '1')!;
  const jlt = SEED_LISTINGS.find((l) => l.id === '3')!;
  const palm = SEED_LISTINGS.find((l) => l.id === '18')!;

  const sJvc = scoreListing(jvc, SARA_QUIZ_PRESET, INITIAL_PREFERENCE_VECTOR).score;
  const sJlt = scoreListing(jlt, SARA_QUIZ_PRESET, INITIAL_PREFERENCE_VECTOR).score;
  const sPalm = scoreListing(palm, SARA_QUIZ_PRESET, INITIAL_PREFERENCE_VECTOR).score;

  assert.ok(sJvc > sPalm, `Expected JVC (${sJvc}) > Palm (${sPalm})`);
  assert.ok(sJlt > sPalm, `Expected JLT (${sJlt}) > Palm (${sPalm})`);
});

test('rankListings returns all 20 listings sorted descending by score', () => {
  const ranked = rankListings(
    SEED_LISTINGS,
    SARA_QUIZ_PRESET,
    INITIAL_PREFERENCE_VECTOR
  );
  assert.equal(ranked.length, 20);
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(ranked[i - 1].score >= ranked[i].score);
  }
});

test('updatePreferenceVector boosts score for favoured area after right swipe', () => {
  const jvc1 = SEED_LISTINGS.find((l) => l.id === '1')!;
  const jvc2 = SEED_LISTINGS.find((l) => l.id === '12')!;
  const before = scoreListing(jvc2, SARA_QUIZ_PRESET, INITIAL_PREFERENCE_VECTOR).score;

  let vec = updatePreferenceVector(INITIAL_PREFERENCE_VECTOR, jvc1, 'right');
  vec = updatePreferenceVector(vec, jvc1, 'right');
  const after = scoreListing(jvc2, SARA_QUIZ_PRESET, vec).score;

  assert.ok(after >= before);
  const toast = getLearningInsightToast(vec);
  assert.ok(toast && toast.includes('JVC'));
});

test('validateReraBrn rejects fewer than 5 digits or non-digits and accepts 5+ digits', () => {
  assert.equal(validateReraBrn('').valid, false);
  assert.equal(validateReraBrn('1234').valid, false);
  assert.equal(validateReraBrn('12a45').valid, false);
  assert.equal(validateReraBrn('48291').valid, true);
});

test('validateDldPermit validates DLD format and rejects empty/pending', () => {
  assert.equal(validateDldPermit('DLD-7421-2026'), true);
  assert.equal(validateDldPermit('PENDING-CHECK'), false);
  assert.equal(validateDldPermit(''), false);
});
