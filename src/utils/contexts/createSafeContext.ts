import { createContext, useContext } from 'react';

export function createSafeContext<T>(name: string) {
  const Context = createContext<T | undefined>(undefined);

  const useSafe = () => {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error(`${name} must be used within ${name}Provider`);
    }
    return ctx;
  };

  return [Context.Provider, useSafe] as const;
}