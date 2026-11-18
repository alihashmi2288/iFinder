import { Agent } from '../types';

export const SEED_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Aisha Rahman',
    agency: 'Gulf Haven Real Estate',
    reraBrn: '48291',
    initials: 'AR',
    rating: 4.9,
    reviewCount: 42,
    responseTime: 'Usually replies in 12 min',
    languages: ['English', 'Arabic', 'Urdu'],
    verified: true,
  },
  {
    id: 'agent-2',
    name: 'Tariq Al Mansoori',
    agency: 'Crescent Key Properties',
    reraBrn: '51904',
    initials: 'TM',
    rating: 4.8,
    reviewCount: 31,
    responseTime: 'Usually replies in 18 min',
    languages: ['Arabic', 'English'],
    verified: true,
  },
  {
    id: 'agent-3',
    name: 'Nadia Haddad',
    agency: 'Marina & Creek Realty',
    reraBrn: '39412',
    initials: 'NH',
    rating: 4.7,
    reviewCount: 27,
    responseTime: 'Usually replies in 20 min',
    languages: ['English', 'Arabic', 'French'],
    verified: true,
  },
  {
    id: 'agent-4',
    name: 'Rohan Kapoor',
    agency: 'Dune & Skyline Brokers',
    reraBrn: '60738',
    initials: 'RK',
    rating: 4.6,
    reviewCount: 19,
    responseTime: 'Usually replies in 25 min',
    languages: ['English', 'Hindi'],
    verified: true,
  },
  {
    id: 'agent-5',
    name: 'Layla Al Hashimi',
    agency: 'Palm & Hills Estates',
    reraBrn: '44185',
    initials: 'LH',
    rating: 4.9,
    reviewCount: 54,
    responseTime: 'Usually replies in 10 min',
    languages: ['Arabic', 'English'],
    verified: true,
  },
];

export function getAgentById(agentId: string): Agent {
  return SEED_AGENTS.find((a) => a.id === agentId) ?? SEED_AGENTS[0];
}
