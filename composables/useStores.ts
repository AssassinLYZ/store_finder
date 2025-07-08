import { useApolloClient } from '@vue/apollo-composable';
import { GET_STORES } from '../graphql/queries';
import type { Store } from '@/types/store';

type StoresQueryResult = {
  stores: Store[];
};
export async function fetchStores() {
  const client = useApolloClient().client;
  const { data } = await client.query<StoresQueryResult>({
    query: GET_STORES,
    fetchPolicy: 'network-only',
  });
  return data;
}
