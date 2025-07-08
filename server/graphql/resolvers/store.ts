import type { Facilities, Store } from '../../../types/store';
import { readFile } from 'fs/promises';
import path from 'path';
export const getStoresData = async (): Promise<Store[]> => {

  const filePath = path.resolve(process.cwd(), 'public', 'jumbo-store-data.json');


  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/jumbo-store-data.json`;
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch store data');
      }
      const data = await response.json();
      if (!data.stores) {
        throw new Error('Stores not found in data');
      }
      return data.stores;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw new Error('Store data file not found');
    }
  } else {
    try {
      const data = await readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(data);
      if (!parsedData.stores) {
        throw new Error('Stores not found in data');
      }
      return parsedData.stores;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw new Error('Store data file not found');
    }
  }
};
export const storeResolvers = {
  Query: {
    stores: async () => {
      return await getStoresData();
    },

    store: async (_: unknown, { storeId }: { storeId: string }) => {
      const stores = await getStoresData();
      return stores.find((store: Store) => store.storeId === storeId);
    },

    storesByCity: async (_: unknown, { city }: { city: string }) => {
      const stores = await getStoresData();
      return stores.filter((store: Store) =>
        store.location.address.city.toLowerCase().includes(city.toLowerCase())
      );
    },

    storesWithFacility: async (_: unknown, { facility }: { facility: string }) => {
      const stores = await getStoresData();
      return stores.filter((store: Store) => {
        const facilities = store.facilities as Facilities;
        return facilities[facility as keyof Facilities] === true;
      });
    },
  },
};