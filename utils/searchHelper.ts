import type { Store, Suggestion } from '@/types/store';
import { normalizeStr } from './helper';

export function getSuggestions(query: string, stores: Store[]): Suggestion[] {
  const normalizedQuery = normalizeStr(query);

  const cities = new Map<string, Store[]>();
  const streets = new Map<string, Store[]>();
  const storeNames = new Map<string, Store[]>();

  stores.forEach((store) => {
    const { city, street } = store.location.address;
    const name = store.name;

    const normalizedCity = normalizeStr(city);
    const normalizedStreet = normalizeStr(street);
    const normalizedName = normalizeStr(name);


    if (
      normalizedCity.includes(normalizedQuery) ||
      normalizedStreet.includes(normalizedQuery) ||
      normalizedName.includes(normalizedQuery)
    ) {
      if (normalizedCity.includes(normalizedQuery)) {
        cities.set(city, [...(cities.get(city) || []), store]);
      }

      if (normalizedStreet.includes(normalizedQuery)) {
        streets.set(street, [...(streets.get(street) || []), store]);
      }

      if (normalizedName.includes(normalizedQuery)) {
        storeNames.set(name, [...(storeNames.get(name) || []), store]);
      }
    }
  });

  return [
    ...mapToSuggestions(cities, 'City', (city) => city),
    ...mapToSuggestions(streets, 'Street', (street) => street),
    ...mapToSuggestions(storeNames, 'Store', (name) => name),
  ];
}


function mapToSuggestions(
  map: Map<string, Store[]>,
  type: 'City' | 'Street' | 'Store',
  getText: (key: string) => string,
): Suggestion[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([key, data]) => ({
      id: `${type.toLowerCase()}-${key}`,
      text: getText(key),
      type,
      count: data.length,
      data,
    }));
}
