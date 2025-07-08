import { vi, describe, it, expect } from 'vitest';
import { fetchStores } from '../useStores';
import { useApolloClient } from '@vue/apollo-composable';
import type { Mock } from 'vitest';

vi.mock('@vue/apollo-composable', () => ({
  useApolloClient: vi.fn(),
}));

describe('fetchStores', () => {
  it('should call client.query and return data', async () => {
    const mockQuery = vi.fn().mockResolvedValue({
      data: { stores: [{ id: 1, name: 'Store 1' }] },
    });
    const mockedUseApolloClient = useApolloClient as Mock;
    mockedUseApolloClient.mockReturnValue({
      client: { query: mockQuery },
    });

    const result = await fetchStores();

    expect(mockQuery).toHaveBeenCalledWith({
      query: expect.anything(),
      fetchPolicy: 'network-only',
    });

    expect(result).toEqual({ stores: [{ id: 1, name: 'Store 1' }] });
  });
});
