import { NearbyAmenity } from '../types';

const compactFormatter = new Intl.NumberFormat('en-AE', {
  maximumFractionDigits: 2,
});

const fullFormatter = new Intl.NumberFormat('en-AE', {
  maximumFractionDigits: 0,
});

export function formatAEDCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const rounded = Number(millions.toFixed(2));
    return `AED ${compactFormatter.format(rounded)}M`;
  }
  if (amount >= 1_000) {
    return `AED ${Math.round(amount / 1_000)}K`;
  }
  return `AED ${fullFormatter.format(amount)}`;
}

export function formatAEDFull(amount: number): string {
  return `AED ${fullFormatter.format(amount)}`;
}

export function formatSqft(sqft: number): string {
  return `${fullFormatter.format(sqft)} sq ft`;
}

export function formatNearbySentence(nearby: NearbyAmenity[]): string {
  if (nearby.length === 0) return 'Quiet residential pocket';
  const lower = nearby.map((item) => item.toLowerCase());
  if (lower.length === 1) return `Near a ${lower[0]}`;
  if (lower.length === 2) return `Near a ${lower[0]} and ${lower[1]}`;
  return `Near a ${lower[0]}, ${lower[1]}, and ${lower[2]}`;
}

export interface ComputedSlot {
  id: string;
  shortLabel: string; // e.g., "Sat 10:00"
  fullDateLabel: string; // e.g., "Sat, 21 Nov · 10:00 AM"
  isoStart: string;
}

export function getUpcomingViewingSlots(baseDate = new Date()): ComputedSlot[] {
  const dayOfWeek = baseDate.getDay(); // 0 = Sun, 6 = Sat
  const daysUntilSat = dayOfWeek === 6 ? 7 : (6 - dayOfWeek + 7) % 7 || 7;
  const satDate = new Date(baseDate);
  satDate.setDate(baseDate.getDate() + daysUntilSat);

  const sunDate = new Date(satDate);
  sunDate.setDate(satDate.getDate() + 1);

  const dateFmt = new Intl.DateTimeFormat('en-AE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const makeIso = (d: Date, hour: number) => {
    const copy = new Date(d);
    copy.setHours(hour, 0, 0, 0);
    return copy.toISOString();
  };

  return [
    {
      id: 'sat-10',
      shortLabel: 'Sat 10:00',
      fullDateLabel: `${dateFmt.format(satDate)} · 10:00`,
      isoStart: makeIso(satDate, 10),
    },
    {
      id: 'sat-14',
      shortLabel: 'Sat 14:00',
      fullDateLabel: `${dateFmt.format(satDate)} · 14:00`,
      isoStart: makeIso(satDate, 14),
    },
    {
      id: 'sun-11',
      shortLabel: 'Sun 11:00',
      fullDateLabel: `${dateFmt.format(sunDate)} · 11:00`,
      isoStart: makeIso(sunDate, 11),
    },
  ];
}

export function downloadViewingICS(params: {
  title: string;
  location: string;
  agentName: string;
  agency: string;
  isoStart: string;
}): void {
  const start = new Date(params.isoStart);
  const end = new Date(start.getTime() + 45 * 60 * 1000);

  const toICSDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//iFinder//Dubai Property Viewing//EN',
    'BEGIN:VEVENT',
    `UID:ifinder-${Date.now()}@ifinder.ae`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:Property Viewing: ${params.title}`,
    `LOCATION:${params.location}, Dubai, UAE`,
    `DESCRIPTION:Verified viewing with ${params.agentName} (${params.agency}) booked via iFinder.`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ifinder-viewing.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
