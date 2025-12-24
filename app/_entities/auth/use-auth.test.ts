import { renderHook } from '@testing-library/react';
import { useAuth } from './use-auth';

describe('useAuth', () => {
  it('throws error when used outside AuthProvider', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});
