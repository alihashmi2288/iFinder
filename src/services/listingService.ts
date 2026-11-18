import { SEED_LISTINGS } from '../data/listings';
import { Listing, NearbyAmenity, PropertyType } from '../types';

export interface CreateListingInput {
  title: string;
  area: string;
  priceAED: number;
  sizeSqft: number;
  beds: number;
  baths: number;
  roiPercent: number;
  commuteMinutes: number;
  nearby: NearbyAmenity[];
  propertyType: PropertyType;
  furnished: boolean;
  permitNo: string;
  description: string;
  agentId: string;
}

export function validateDldPermit(permitNo: string): boolean {
  const trimmed = permitNo.trim().toUpperCase();
  return /^DLD-\d{3,6}-\d{4}$/.test(trimmed) || /^\d{6,10}$/.test(trimmed);
}

export async function getAllListings(): Promise<Listing[]> {
  return Promise.resolve(SEED_LISTINGS);
}

export async function verifyAndBuildListing(
  input: CreateListingInput,
  hasValidAgentLicence: boolean
): Promise<Listing> {
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const permitValid = validateDldPermit(input.permitNo);
  const verified = hasValidAgentLicence && permitValid;

  const photoMap: Record<PropertyType, string> = {
    Studio: '/src/assets/images/dubai_studio_modern_1794987394285.jpg',
    Apartment: '/src/assets/images/dubai_apartment_jvc_1794987394072.jpg',
    Townhouse: '/src/assets/images/dubai_townhouse_exterior_1794987396189.jpg',
    Villa: '/src/assets/images/dubai_villa_mirdif_1794987397139.jpg',
  };

  return {
    id: `custom-${Date.now()}`,
    title: input.title.trim(),
    area: input.area.trim(),
    priceAED: input.priceAED,
    sizeSqft: input.sizeSqft,
    beds: input.beds,
    baths: input.baths,
    roiPercent: input.roiPercent,
    commuteMinutes: input.commuteMinutes,
    nearby: input.nearby,
    propertyType: input.propertyType,
    furnished: input.furnished,
    yearBuilt: 2024,
    description:
      input.description.trim() ||
      `Bright ${input.title.trim()} located in ${input.area.trim()} with direct community amenities and strong rental demand.`,
    highlights: [
      `${input.roiPercent.toFixed(1)}% est. yield`,
      `${input.commuteMinutes} min commute`,
      verified ? 'DLD permit verified' : 'Permit check pending',
    ],
    agentId: input.agentId,
    verified,
    permitNo: input.permitNo.trim() || 'PENDING-CHECK',
    photoSeed: `custom-${Date.now()}`,
    photoUrl: photoMap[input.propertyType],
    galleryUrls: [
      photoMap[input.propertyType],
      '/src/assets/images/dubai_kitchen_interior_1794987397496.jpg',
      '/src/assets/images/dubai_marina_2bed_1794987395161.jpg',
    ],
    listedDaysAgo: 0,
    isCustom: true,
  };
}
