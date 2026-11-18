import { formatAEDFull } from '../utils/format';
import { Agent, Listing, ViewingRequest, ViewingStatus } from '../types';

export async function createViewingRequest(params: {
  listing: Listing;
  agent: Agent;
  buyerName: string;
  buyerMatchPercent: number;
  slotLabel: string;
  slotIsoStart: string;
}): Promise<ViewingRequest> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return {
    id: `vr-${Date.now()}`,
    listingId: params.listing.id,
    agentId: params.agent.id,
    buyerName: params.buyerName,
    buyerMatchPercent: params.buyerMatchPercent,
    slotLabel: params.slotLabel,
    slotIsoStart: params.slotIsoStart,
    status: 'Requested',
    createdAt: new Date().toISOString(),
  };
}

export async function updateViewingRequestStatus(
  id: string,
  status: ViewingStatus,
  suggestedSlot?: string
): Promise<{ id: string; status: ViewingStatus; suggestedSlot?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { id, status, suggestedSlot };
}

export async function generateAgentChatReply(params: {
  buyerText: string;
  listing: Listing;
  agent: Agent;
}): Promise<string> {
  const delay = 1000 + Math.floor(Math.random() * 600);
  await new Promise((resolve) => setTimeout(resolve, delay));

  const lower = params.buyerText.toLowerCase();
  const annualRent = Math.round(
    params.listing.priceAED * (params.listing.roiPercent / 100)
  );

  if (lower.includes('available') || lower.includes('still')) {
    return `Yes, the ${params.listing.title} is available and DLD permit ${params.listing.permitNo} is active. Would you like to lock in a viewing slot this weekend?`;
  }
  if (lower.includes('negotiate') || lower.includes('price') || lower.includes('offer')) {
    return `The seller is asking ${formatAEDFull(params.listing.priceAED)}, with slight flexibility for a clean cash or pre-approved buyer. Viewing first helps us structure a strong offer.`;
  }
  if (lower.includes('parking') || lower.includes('service') || lower.includes('fee')) {
    return `It includes covered basement parking, and annual rental income is estimated around ${formatAEDFull(annualRent)} (${params.listing.roiPercent.toFixed(1)}% yield). I can share the full service-charge breakdown at the viewing.`;
  }
  return `Thanks for reaching out about ${params.listing.title}. I’m ${params.agent.name} (${params.agent.agency}, BRN ${params.agent.reraBrn})—let me know your preferred time to tour the unit.`;
}
