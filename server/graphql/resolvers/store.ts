import type { Facilities, Store } from '../../../types/store';

// import { readFile } from 'fs/promises';
// import path, { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
// const config = useRuntimeConfig();

// export const getStoresData = async (): Promise<Store[]> => {
//   const fileUrl = config.public.apiUrl + '/data/jumbo-store-data.json';
//   try {
//     const response = await fetch(fileUrl);
//     if (!response.ok) {
//       throw new Error('Failed to fetch store data');
//     }
//     const data = await response.json();
//     if (!data.stores) {
//       throw new Error('Stores not found in data');
//     }
//     return data.stores;
//   } catch (error) {
//     console.error('Error fetching stores:', error);
//     throw new Error('Store data file not found');
//   }
// };

export const getStoresData = async (): Promise<Store[]> => {
  const data = await useStorage('data').getItem('jumbo-store-data.json');
  if (!data) throw new Error('Store data file not found');
  const stores = typeof data === 'string' ? JSON.parse(data).stores : (data as any).stores;
  return stores;
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