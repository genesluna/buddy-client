export const PET_QUERY_KEYS = {
  all: ['pets'] as const,
  lists: () => [...PET_QUERY_KEYS.all, 'list'] as const,
  list: (params: string) => [...PET_QUERY_KEYS.all, 'list', params] as const,
  details: () => [...PET_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PET_QUERY_KEYS.all, 'detail', id] as const,
} as const;

export const PET_PUBLIC_QUERY_KEYS = PET_QUERY_KEYS.all;
