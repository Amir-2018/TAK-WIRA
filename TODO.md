# Player Negotiation Feature - Implementation Complete

## Features Implemented

### 1. Negotiation System
- Coach can negotiate with players from other teams in active tournaments
- Three possible responses:
  - **Accepted**: Deal successful
  - **Refused**: Offer rejected
  - **Counter-Offer**: Club demands higher price

### 2. Negotiation Flow
1. Coach selects an active tournament
2. Views teams participating in the tournament
3. Clicks on a team to view its players
4. Clicks "💰 Negotiate" button on a player
5. Ends offer amount in euros
6. Receives immediate response (simulated)

### 3. Response Types
- **Pending**: Awaiting response (shown with hourglass)
- **Accepted**: Green badge, deal done
- **Refused**: Red badge, offer rejected
- **Counter-Offer**: Blue badge, with higher price demand

### 4. Counter-Offer Handling
- Shows comparison of original offer vs counter-offer
- Options to:
  - Accept counter-offer
  - Refuse
  - Make a new counter-offer (90% of their demand)

## Data Model

### Negotiation Interface
```typescript
interface Negotiation {
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
```

## Sample Data
- 3 sample negotiations with different statuses
- Pedri (Barcelona): €80M - Accepted
- Jamal Musiala (Bayern): €90M - Counter-offer €120M
- Kevin De Bruyne (Man City): €50M - Refused

## Files Modified
- `src/types/user.ts` - Added Negotiation interface
- `src/context/AppContext.tsx` - Added negotiation state and functions
- `src/screens/TournamentTeamPlayersScreen.tsx` - Added negotiation UI

## User Flow
1. **Tournament List** → Select Active Tournament
2. **Teams List** → Select Team
3. **Players List** → Click "Negotiate" on player
4. **Negotiation Modal** → Enter offer amount
5. **Response** → Accept/Refuse/Counter
