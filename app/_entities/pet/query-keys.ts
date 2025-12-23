export const PET_QUERY_KEYS = {
  all: 'pets',
  lists: () => [PET_QUERY_KEYS.all] as const,
  list: (params: string) => [PET_QUERY_KEYS.all, params] as const,
  details: () => ['pet'] as const,
  detail: (id: string) => ['pet', id] as const,
} as const;

export const PUBLIC_QUERY_KEYS = [PET_QUERY_KEYS.all, 'pet'] as const;
