export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'coach' | 'player' | 'admin';
}

export interface Tournament {
  id: string;
  name: string;
  teams: number;
  date: string;
  image: string;
  status: 'Live' | 'Upcoming' | 'Active' | 'Completed';
  description?: string;
  ownerId: string;
  results?: {
    winner: {
      teamName: string;
      logo: string;
    };
    topScorer: {
      playerName: string;
      goals: number;
      image?: string;
    };
    rankings: {
      teamName: string;
      logo: string;
      rank: 1 | 2 | 3;
    }[];
  };
}

export interface Match {
  id: string;
  tournamentId: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
  status: 'played' | 'upcoming' | 'live';
  homeScore?: number;
  awayScore?: number;
  yellowCards?: { team: 'home' | 'away'; count: number };
  redCards?: { team: 'home' | 'away'; count: number };
  convokedPlayers?: string[];
  referees?: string[];
  homeFormation?: {
    formation: string; // e.g., '4-4-2'
    players: {
      id: string;
      name: string;
      position: { x: number; y: number }; // Percentage coordinates for the pitch
      role: string;
    }[];
  };
  awayFormation?: {
    formation: string;
    players: {
      id: string;
      name: string;
      position: { x: number; y: number };
      role: string;
    }[];
  };
}

export interface CardEvent {
  id: string;
  matchId: string;
  team: 'home' | 'away';
  playerName: string;
  cardType: 'yellow' | 'red';
  minute: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  stadium: string;
  founded: number;
  city: string;
  colors: {
    primary: string;
    secondary: string;
  };
  playerIds: string[];
  tournamentIds: string[];
  agenda?: {
    date: string;
    opponent: string;
    tournament: string;
    matchId: string;
  }[];
}

export interface Mercato {
  id: string;
  tournamentId: string;
  name: string;
  startDate: string;
  endDate: string;
  maxTransfers: number;
  status: 'upcoming' | 'active' | 'closed';
  ownerId: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  mercatoId: string;
  playerId: string;
  playerName: string;
  fromTeam: string;
  toTeam: string;
  transferFee: number;
  status: 'pending' | 'completed' | 'cancelled';
  transferDate: string;
  playerPosition?: string;
  playerAge?: number;
}

export interface Negotiation {
  id: string;
  tournamentId: string;
  playerId: string;
  playerName: string;
  playerPosition: string;
  playerAge: number;
  fromTeam: string;
  offeredAmount: number;
  status: 'pending' | 'accepted' | 'refused' | 'counter_offer';
  counterOfferAmount?: number;
  createdAt: string;
  respondedAt?: string;
}

