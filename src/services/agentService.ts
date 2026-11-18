import { FeedImportSummary, Listing } from '../types';

export function validateReraBrn(brn: string): {
  valid: boolean;
  error?: string;
} {
  const digits = brn.trim();
  if (!digits) {
    return { valid: false, error: 'Enter your 5-digit RERA broker number (BRN).' };
  }
  if (!/^\d+$/.test(digits)) {
    return { valid: false, error: 'RERA BRN must contain digits only.' };
  }
  if (digits.length < 5 || digits.length > 7) {
    return {
      valid: false,
      error: 'RERA BRN must be at least 5 digits (e.g. 48291).',
    };
  }
  return { valid: true };
}

export async function verifyReraNumberAsync(brn: string): Promise<{
  verified: boolean;
  error?: string;
}> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const check = validateReraBrn(brn);
  if (!check.valid) {
    return { verified: false, error: check.error };
  }
  return { verified: true };
}

export async function importFeedAsync(
  source: 'Property Finder XML' | 'Bayut Feed' | 'CSV Upload',
  agentId: string
): Promise<{ summary: FeedImportSummary; importedListings: Listing[] }> {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const now = Date.now();
  const sampleImported: Listing[] = [
    {
      id: `feed-${now}-1`,
      title: '1-bed apartment, JLT',
      area: 'JLT',
      priceAED: 1_320_000,
      sizeSqft: 815,
      beds: 1,
      baths: 2,
      roiPercent: 6.8,
      commuteMinutes: 12,
      nearby: ['Metro', 'School'],
      propertyType: 'Apartment',
      furnished: false,
      yearBuilt: 2022,
      description:
        'Imported via brokerage feed: bright 1-bedroom overlooking JLT Cluster D park with easy DMCC Metro access.',
      highlights: ['Feed synced', 'Metro walk', '6.8% yield'],
      agentId,
      verified: true,
      permitNo: 'DLD-8812-2026',
      photoSeed: `feed-${now}-1`,
      photoUrl: '/src/assets/images/dubai_marina_2bed_1794987395161.jpg',
      galleryUrls: [
        '/src/assets/images/dubai_marina_2bed_1794987395161.jpg',
        '/src/assets/images/dubai_kitchen_interior_1794987397496.jpg',
      ],
      listedDaysAgo: 0,
      isCustom: true,
    },
    {
      id: `feed-${now}-2`,
      title: 'Studio, JVC',
      area: 'JVC',
      priceAED: 690_000,
      sizeSqft: 440,
      beds: 0,
      baths: 1,
      roiPercent: 7.7,
      commuteMinutes: 16,
      nearby: ['Mosque'],
      propertyType: 'Studio',
      furnished: true,
      yearBuilt: 2023,
      description:
        'Imported via brokerage feed: contemporary studio unit awaiting DLD Trakheesi permit confirmation.',
      highlights: ['Needs permit no.', 'Furnished', '7.7% est. yield'],
      agentId,
      verified: false,
      permitNo: 'PENDING-CHECK',
      photoSeed: `feed-${now}-2`,
      photoUrl: '/src/assets/images/dubai_studio_modern_1794987394285.jpg',
      galleryUrls: [
        '/src/assets/images/dubai_studio_modern_1794987394285.jpg',
        '/src/assets/images/dubai_apartment_jvc_1794987394072.jpg',
      ],
      listedDaysAgo: 0,
      isCustom: true,
    },
  ];

  return {
    summary: {
      source,
      importedCount: 12,
      pendingPermitCount: 2,
      timestamp: new Date().toISOString(),
    },
    importedListings: sampleImported,
  };
}
