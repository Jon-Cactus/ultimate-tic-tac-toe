import { createContext, useContext } from 'react';

export type Mode = 'local' | 'online' | null;

export const ModeContext = createContext<Mode>(null);
export const useMode = () => useContext(ModeContext);

export type Player = 'X' | 'O' | null;

export const PlayerContext = createContext<Player>(null);
export const usePlayer = () => useContext(PlayerContext);