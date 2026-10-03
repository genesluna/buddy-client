export const TERMS_QUERY_KEYS = {
  all: ['terms'] as const,
  active: () => [...TERMS_QUERY_KEYS.all, 'active'] as const,
};
