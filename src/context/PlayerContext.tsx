import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Player, PlayerFormData } from '../types/player';

interface PlayerContextType {
  players: Player[];
  addPlayer: (player: PlayerFormData) => void;
  updatePlayer: (id: string, player: PlayerFormData) => void;
  deletePlayer: (id: string) => void;
  getPlayer: (id: string) => Player | undefined;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Sample initial players
const initialPlayers: Player[] = [
  {
    id: '1',
    name: 'Mohamed Salah',
    position: 'Forward',
    number: 11,
    age: 32,
    nationality: 'Egypt',
    height: '175cm',
    weight: '71kg',
    image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=200&auto=format',
  },
  {
    id: '2',
    name: 'Kevin De Bruyne',
    position: 'Midfielder',
    number: 17,
    age: 33,
    nationality: 'Belgium',
    height: '181cm',
    weight: '70kg',
    image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=200&auto=format',
  },
  {
    id: '3',
    name: 'Virgil van Dijk',
    position: 'Defender',
    number: 4,
    age: 33,
    nationality: 'Netherlands',
    height: '193cm',
    weight: '92kg',
    image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=200&auto=format',
  },
  {
    id: '4',
    name: 'Alisson Becker',
    position: 'Goalkeeper',
    number: 1,
    age: 32,
    nationality: 'Brazil',
    height: '191cm',
    weight: '91kg',
    image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=200&auto=format',
  },
  {
    id: '5',
    name: 'Erling Haaland',
    position: 'Forward',
    number: 9,
    age: 24,
    nationality: 'Norway',
    height: '194cm',
    weight: '88kg',
    image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=200&auto=format',
  },
];

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const addPlayer = (playerData: PlayerFormData) => {
    const newPlayer: Player = {
      ...playerData,
      id: Date.now().toString(),
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const updatePlayer = (id: string, playerData: PlayerFormData) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...playerData, id } : player
      )
    );
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
  };

  const getPlayer = (id: string) => {
    return players.find((player) => player.id === id);
  };

  return (
    <PlayerContext.Provider
      value={{ players, addPlayer, updatePlayer, deletePlayer, getPlayer }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayers() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayerProvider');
  }
  return context;
}

