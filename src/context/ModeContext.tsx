import { createContext, useContext } from 'react';

export type Mode = 'local' | 'online' | null;

export const ModeContext = createContext<Mode>(null);
export const useMode = () => useContext(ModeContext);