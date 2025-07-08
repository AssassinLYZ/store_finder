import { describe, it, expect } from 'vitest';
import { getSuggestions } from '../searchHelper';
import type { Store } from '@/types/store';
import { mockedStores } from '../../test/mockedData';

const stores: Store[] = mockedStores;

describe('getSuggestions', () => {
  it('returns correct suggestions for city query', () => {
    const results = getSuggestions('nue', stores);
    expect(results.some(r => r.type === 'City' && r.text === 'NUENEN')).toBe(true);
    expect(results.find(r => r.type === 'City' && r.text === 'NUENEN')?.count).toBe(1);
  });

  it('returns correct suggestions for street query', () => {
    const results = getSuggestions('eter', stores);
    expect(results.some(r => r.type === 'Street' && r.text.startsWith('Pieter Christiaanstraat'))).toBe(true);
    expect(results.find(r => r.type === 'Street' && r.text.startsWith('Pieter Christiaanstraat'))?.count).toBe(1);
  });

  it('returns correct suggestions for store name query', () => {
    const results = getSuggestions('kenswaard', stores);
    expect(results.some(r => r.type === 'Store' && r.text === 'Jumbo Valkenswaard Nieuwe Waalreseweg')).toBe(true);
  });

  it('returns empty array for no match', () => {
    const results = getSuggestions('nonexistent', stores);
    expect(results.length).toBe(0);
  });
});
