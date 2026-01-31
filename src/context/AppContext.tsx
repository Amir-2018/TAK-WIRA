import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Tournament, Match, CardEvent, Team, Mercato, Transfer, Negotiation } from '../types/user';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  tournaments: Tournament[];
  matches: Match[];
  cardEvents: CardEvent[];
  teams: Team[];
  mercatos: Mercato[];
  transfers: Transfer[];
  negotiations: Negotiation[];
  login: (email: string, role?: 'player' | 'coach') => void;
  logout: () => void;
  addTournament: (tournament: Omit<Tournament, 'id'>) => void;
  updateTournament: (id: string, tournament: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  updateMatchConvokedPlayers: (matchId: string, convokedPlayerIds: string[]) => void;
  addCardEvent: (cardEvent: Omit<CardEvent, 'id'>) => void;
  addMercato: (mercato: Omit<Mercato, 'id'>) => void;
  updateMercato: (id: string, mercato: Partial<Mercato>) => void;
  deleteMercato: (id: string) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void;
  updateTransferStatus: (id: string, status: Transfer['status']) => void;
  deleteTransfer: (id: string) => void;
  createNegotiation: (negotiation: Omit<Negotiation, 'id'>) => void;
  respondToNegotiation: (id: string, status: 'accepted' | 'refused' | 'counter_offer', counterOfferAmount?: number) => void;
  deleteNegotiation: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample authenticated user
const sampleUser: User = {
  id: '1',
  name: 'Coach Mohamed',
  email: 'coach@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format',
  role: 'coach',
};

// Sample user tournaments
const sampleTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Dwret smayra',
    teams: 32,
    date: 'Sep - May',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format',
    status: 'Live',
    ownerId: '1',
  },
  {
    id: '2',
    name: 'Dawret bray7ia',
    teams: 48,
    date: 'June - July',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400&auto=format',
    status: 'Upcoming',
    ownerId: '1',
  },
  {
    id: '3',
    name: 'Dawret Ramadan',
    teams: 24,
    date: 'March - April',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=400&auto=format',
    status: 'Completed',
    ownerId: '1',
    results: {
      winner: {
        teamName: 'Al Katiba',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
      },
      topScorer: {
        playerName: 'Marwen dov',
        goals: 12,
        image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=200&auto=format',
      },
      rankings: [
        { rank: 1, teamName: 'Al Katiba', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png' },
        { rank: 2, teamName: 'Sou9our', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png' },
        { rank: 3, teamName: 'Noumour', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png' },
      ],
    },
  },
];

// Sample matches
const sampleMatches: Match[] = [
  {
    id: '1',
    tournamentId: '1',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    date: '2024-03-15',
    time: '20:00',
    stadium: 'Santiago Bernabéu',
    status: 'played',
    homeScore: 2,
    awayScore: 1,
    yellowCards: { team: 'away', count: 3 },
    redCards: { team: 'away', count: 1 },
    convokedPlayers: ['1', '2', '3'],
  },
  {
    id: '2',
    tournamentId: '1',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    date: '2024-03-20',
    time: '18:30',
    stadium: 'Allianz Arena',
    status: 'upcoming',
    convokedPlayers: ['1', '4'],
  },
  {
    id: '3',
    tournamentId: '2',
    homeTeam: 'France',
    awayTeam: 'Germany',
    date: '2024-03-25',
    time: '21:00',
    stadium: 'Stade de France',
    status: 'upcoming',
    convokedPlayers: [],
  },
  {
    id: '4',
    tournamentId: '1',
    homeTeam: 'PSG',
    awayTeam: 'Lyon',
    date: '2024-03-10',
    time: '20:00',
    stadium: 'Parc des Princes',
    status: 'played',
    homeScore: 3,
    awayScore: 0,
    yellowCards: { team: 'away', count: 2 },
    redCards: { team: 'home', count: 1 },
    convokedPlayers: ['2', '5'],
  },
  {
    id: '5',
    tournamentId: '1',
    homeTeam: 'Al Katiba',
    awayTeam: 'Sou9our',
    date: new Date().toISOString().split('T')[0], // Today
    time: '21:00',
    stadium: 'Stade Municipal',
    status: 'upcoming',
    referees: ['Ahmed Ben Salah', 'Mohamed Trabelsi', 'Ali Mansour'],
    homeFormation: {
      formation: '4-3-3',
      players: [
        { id: '1', name: 'Alisson', position: { x: 50, y: 90 }, role: 'GK' },
        { id: '2', name: 'VVD', position: { x: 30, y: 70 }, role: 'CB' },
        { id: '3', name: 'Konate', position: { x: 70, y: 70 }, role: 'CB' },
        { id: '4', name: 'Trent', position: { x: 10, y: 70 }, role: 'RB' },
        { id: '5', name: 'Robbo', position: { x: 90, y: 70 }, role: 'LB' },
        { id: '6', name: 'Mac Allister', position: { x: 50, y: 50 }, role: 'CM' },
        { id: '7', name: 'Szobo', position: { x: 30, y: 40 }, role: 'CM' },
        { id: '8', name: 'Jones', position: { x: 70, y: 40 }, role: 'CM' },
        { id: '9', name: 'Salah', position: { x: 20, y: 20 }, role: 'RW' },
        { id: '10', name: 'Darwin', position: { x: 50, y: 15 }, role: 'ST' },
        { id: '11', name: 'Diaz', position: { x: 80, y: 20 }, role: 'LW' },
      ],
    },
    awayFormation: {
      formation: '4-4-2',
      players: [
        { id: '12', name: 'Ter Stegen', position: { x: 50, y: 90 }, role: 'GK' },
        { id: '13', name: 'Araujo', position: { x: 40, y: 75 }, role: 'CB' },
        { id: '14', name: 'Kounde', position: { x: 60, y: 75 }, role: 'CB' },
        { id: '15', name: 'Cancelo', position: { x: 15, y: 75 }, role: 'RB' },
        { id: '16', name: 'Balde', position: { x: 85, y: 75 }, role: 'LB' },
        { id: '17', name: 'Pedri', position: { x: 35, y: 50 }, role: 'CM' },
        { id: '18', name: 'Gavi', position: { x: 65, y: 50 }, role: 'CM' },
        { id: '19', name: 'Yamal', position: { x: 15, y: 45 }, role: 'RM' },
        { id: '20', name: 'Felix', position: { x: 85, y: 45 }, role: 'LM' },
        { id: '21', name: 'Lewandowski', position: { x: 40, y: 20 }, role: 'ST' },
        { id: '22', name: 'Roque', position: { x: 60, y: 20 }, role: 'ST' },
      ],
    },
  },
];

// Sample card events
const sampleCardEvents: CardEvent[] = [
  {
    id: '1',
    matchId: '1',
    team: 'away',
    playerName: 'Pedri',
    cardType: 'yellow',
    minute: 23,
  },
  {
    id: '2',
    matchId: '1',
    team: 'away',
    playerName: 'Araujo',
    cardType: 'red',
    minute: 45,
  },
  {
    id: '3',
    matchId: '4',
    team: 'home',
    playerName: 'Mbappé',
    cardType: 'red',
    minute: 67,
  },
];

// Sample teams
const sampleTeams: Team[] = [
  {
    id: '1',
    name: 'Al Katiba',
    shortName: 'AKT',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png',
    stadium: 'Stade Municipal',
    founded: 2015,
    city: 'Tunis',
    colors: { primary: '#FFF', secondary: '#000' },
    playerIds: ['1', '2', '3'],
    tournamentIds: ['1'],
    agenda: [
      { matchId: '5', date: new Date().toISOString().split('T')[0], opponent: 'Sou9our', tournament: 'Dawret Ramadan' },
      { matchId: '10', date: '2024-03-25', opponent: 'Noumour', tournament: 'Dawret Ramadan' },
    ]
  },
  {
    id: '2',
    name: 'Sou9our',
    shortName: 'SQR',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
    stadium: 'Camp Nou',
    founded: 2018,
    city: 'Tunis',
    colors: { primary: '#004D98', secondary: '#A50044' },
    playerIds: ['4', '5'],
    tournamentIds: ['1'],
    agenda: [
      { matchId: '5', date: new Date().toISOString().split('T')[0], opponent: 'Al Katiba', tournament: 'Dawret Ramadan' },
    ]
  },
  {
    id: '3',
    name: 'Noumour',
    shortName: 'BAY',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/1200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    stadium: 'Allianz Arena',
    founded: 1900,
    city: 'Munich',
    colors: { primary: '#DC052D', secondary: '#FFFFFF' },
    playerIds: ['6', '7'],
    tournamentIds: ['1'],
  },
  {
    id: '4',
    name: 'Manchester City',
    shortName: 'MCI',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
    stadium: 'Etihad Stadium',
    founded: 1880,
    city: 'Manchester',
    colors: { primary: '#6CABDD', secondary: '#1C2C5B' },
    playerIds: ['8', '9'],
    tournamentIds: ['2'],
  },
  {
    id: '5',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png',
    stadium: 'Parc des Princes',
    founded: 1970,
    city: 'Paris',
    colors: { primary: '#004170', secondary: '#E63946' },
    playerIds: ['10'],
    tournamentIds: ['1', '2'],
  },
];

// Sample mercatos
const sampleMercatos: Mercato[] = [
  {
    id: '1',
    tournamentId: '1',
    name: 'Winter Mercato 2024',
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    maxTransfers: 5,
    status: 'closed',
    ownerId: '1',
    createdAt: '2023-12-15',
  },
  {
    id: '2',
    tournamentId: '1',
    name: 'Summer Mercato 2024',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    maxTransfers: 8,
    status: 'active',
    ownerId: '1',
    createdAt: '2024-05-01',
  },
  {
    id: '3',
    tournamentId: '2',
    name: 'World Cup Transfer Window',
    startDate: '2025-01-01',
    endDate: '2025-02-28',
    maxTransfers: 10,
    status: 'upcoming',
    ownerId: '1',
    createdAt: '2024-12-01',
  },
];

// Sample transfers
const sampleTransfers: Transfer[] = [
  {
    id: '1',
    mercatoId: '1',
    playerId: '1',
    playerName: 'Aymen za3touta',
    fromTeam: 'Real Madrid',
    toTeam: 'Barcelona',
    transferFee: 150000000,
    status: 'completed',
    transferDate: '2024-02-15',
    playerPosition: 'Forward',
    playerAge: 32,
  },
  {
    id: '2',
    mercatoId: '1',
    playerId: '2',
    playerName: 'Marwen dov',
    fromTeam: 'Bayern Munich',
    toTeam: 'PSG',
    transferFee: 120000000,
    status: 'completed',
    transferDate: '2024-02-20',
    playerPosition: 'Midfielder',
    playerAge: 33,
  },
  {
    id: '3',
    mercatoId: '2',
    playerId: '4',
    playerName: 'Erling Haaland',
    fromTeam: 'Manchester City',
    toTeam: 'Real Madrid',
    transferFee: 200000000,
    status: 'pending',
    transferDate: '2024-07-01',
    playerPosition: 'Forward',
    playerAge: 24,
  },
  {
    id: '4',
    mercatoId: '2',
    playerId: '5',
    playerName: 'Virgil van Dijk',
    fromTeam: 'Barcelona',
    toTeam: 'Bayern Munich',
    transferFee: 85000000,
    status: 'completed',
    transferDate: '2024-06-15',
    playerPosition: 'Defender',
    playerAge: 33,
  },
  {
    id: '5',
    mercatoId: '2',
    playerId: '3',
    playerName: 'Alisson Becker',
    fromTeam: 'PSG',
    toTeam: 'Manchester City',
    transferFee: 65000000,
    status: 'completed',
    transferDate: '2024-06-10',
    playerPosition: 'Goalkeeper',
    playerAge: 32,
  },
];

// Sample negotiations
const sampleNegotiations: Negotiation[] = [
  {
    id: '1',
    tournamentId: '1',
    playerId: '4',
    playerName: 'Pedri',
    playerPosition: 'Midfielder',
    playerAge: 21,
    fromTeam: 'Barcelona',
    offeredAmount: 80000000,
    status: 'accepted',
    createdAt: '2024-03-01',
    respondedAt: '2024-03-02',
  },
  {
    id: '2',
    tournamentId: '1',
    playerId: '6',
    playerName: 'Jamal Musiala',
    playerPosition: 'Midfielder',
    playerAge: 21,
    fromTeam: 'Bayern Munich',
    offeredAmount: 90000000,
    status: 'counter_offer',
    counterOfferAmount: 120000000,
    createdAt: '2024-03-10',
    respondedAt: '2024-03-11',
  },
  {
    id: '3',
    tournamentId: '1',
    playerId: '8',
    playerName: 'Kevin De Bruyne',
    playerPosition: 'Midfielder',
    playerAge: 33,
    fromTeam: 'Manchester City',
    offeredAmount: 50000000,
    status: 'refused',
    createdAt: '2024-03-15',
    respondedAt: '2024-03-16',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(sampleUser); // Auto-login for demo
  const [tournaments, setTournaments] = useState<Tournament[]>(sampleTournaments);
  const [matches, setMatches] = useState<Match[]>(sampleMatches);
  const [cardEvents, setCardEvents] = useState<CardEvent[]>(sampleCardEvents);
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [mercatos, setMercatos] = useState<Mercato[]>(sampleMercatos);
  const [transfers, setTransfers] = useState<Transfer[]>(sampleTransfers);
  const [negotiations, setNegotiations] = useState<Negotiation[]>(sampleNegotiations);

  const isAuthenticated = user !== null;

  const login = (email: string, role: 'player' | 'coach' = 'player') => {
    setUser({
      ...sampleUser,
      name: role === 'coach' ? 'Coach Mohamed' : 'Player Hamza',
      role: role,
      avatar: role === 'coach'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format'
    });
  };

  const logout = () => {
    setUser(null);
  };

  const addTournament = (tournamentData: Omit<Tournament, 'id'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: Date.now().toString(),
    };
    setTournaments((prev) => [...prev, newTournament]);
  };

  const updateTournament = (id: string, tournamentData: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((tournament) =>
        tournament.id === id ? { ...tournament, ...tournamentData } : tournament
      )
    );
  };

  const deleteTournament = (id: string) => {
    setTournaments((prev) => prev.filter((tournament) => tournament.id !== id));
  };

  const updateMatchConvokedPlayers = (matchId: string, convokedPlayerIds: string[]) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, convokedPlayers: convokedPlayerIds } : match
      )
    );
  };

  const addCardEvent = (cardEventData: Omit<CardEvent, 'id'>) => {
    const newCardEvent: CardEvent = {
      ...cardEventData,
      id: Date.now().toString(),
    };
    setCardEvents((prev) => [...prev, newCardEvent]);
  };

  const addMercato = (mercatoData: Omit<Mercato, 'id'>) => {
    const newMercato: Mercato = {
      ...mercatoData,
      id: Date.now().toString(),
    };
    setMercatos((prev) => [...prev, newMercato]);
  };

  const updateMercato = (id: string, mercatoData: Partial<Mercato>) => {
    setMercatos((prev) =>
      prev.map((mercato) =>
        mercato.id === id ? { ...mercato, ...mercatoData } : mercato
      )
    );
  };

  const deleteMercato = (id: string) => {
    setMercatos((prev) => prev.filter((mercato) => mercato.id !== id));
  };

  const addTransfer = (transferData: Omit<Transfer, 'id'>) => {
    const newTransfer: Transfer = {
      ...transferData,
      id: Date.now().toString(),
    };
    setTransfers((prev) => [...prev, newTransfer]);
  };

  const updateTransferStatus = (id: string, status: Transfer['status']) => {
    setTransfers((prev) =>
      prev.map((transfer) =>
        transfer.id === id ? { ...transfer, status } : transfer
      )
    );
  };

  const deleteTransfer = (id: string) => {
    setTransfers((prev) => prev.filter((transfer) => transfer.id !== id));
  };

  const createNegotiation = (negotiationData: Omit<Negotiation, 'id'>) => {
    const newNegotiation: Negotiation = {
      ...negotiationData,
      id: Date.now().toString(),
    };
    setNegotiations((prev) => [...prev, newNegotiation]);
  };

  const respondToNegotiation = (id: string, status: 'accepted' | 'refused' | 'counter_offer', counterOfferAmount?: number) => {
    setNegotiations((prev) =>
      prev.map((negotiation) =>
        negotiation.id === id
          ? {
            ...negotiation,
            status,
            counterOfferAmount: status === 'counter_offer' ? counterOfferAmount : negotiation.counterOfferAmount,
            respondedAt: new Date().toISOString().split('T')[0],
          }
          : negotiation
      )
    );
  };

  const deleteNegotiation = (id: string) => {
    setNegotiations((prev) => prev.filter((negotiation) => negotiation.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        tournaments,
        matches,
        cardEvents,
        teams,
        mercatos,
        transfers,
        negotiations,
        login,
        logout,
        addTournament,
        updateTournament,
        deleteTournament,
        updateMatchConvokedPlayers,
        addCardEvent,
        addMercato,
        updateMercato,
        deleteMercato,
        addTransfer,
        updateTransferStatus,
        deleteTransfer,
        createNegotiation,
        respondToNegotiation,
        deleteNegotiation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

