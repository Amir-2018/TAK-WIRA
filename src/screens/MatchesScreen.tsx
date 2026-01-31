import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  SectionList,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Match, CardEvent } from '../types/user';
import BottomNavBar from '../components/BottomNavBar';

type MatchFilter = 'all' | 'played' | 'upcoming';

export default function MatchesScreen({ navigation }: any) {
  const { matches, cardEvents } = useApp();
  const [filter, setFilter] = useState<MatchFilter>('all');

  const playedMatches = matches.filter((m) => m.status === 'played');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming' || m.status === 'live');

  const getCardsForMatch = (matchId: string): CardEvent[] => {
    return cardEvents.filter((c) => c.matchId === matchId);
  };

  const renderMatchCard = ({ item }: { item: Match }) => {
    const cards = getCardsForMatch(item.id);
    const isUpcoming = item.status === 'upcoming';

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => {
          if (isUpcoming) {
            navigation.navigate('Convocation', { matchId: item.id });
          }
        }}
        activeOpacity={isUpcoming ? 0.8 : 1}
      >
        <View style={styles.matchHeader}>
          <Text style={styles.matchDate}>
            {item.date} • {item.time}
          </Text>
          <View
            style={[
              styles.statusBadge,
              item.status === 'played' && styles.statusPlayed,
              item.status === 'upcoming' && styles.statusUpcoming,
              item.status === 'live' && styles.statusLive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'played' && styles.statusTextPlayed,
                item.status === 'upcoming' && styles.statusTextUpcoming,
              ]}
            >
              {item.status === 'live' ? 'LIVE' : item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamContainer}>
            <View style={styles.teamLogo}>
              <Text style={styles.teamLogoText}>{item.homeTeam.charAt(0)}</Text>
            </View>
            <Text style={styles.teamName}>{item.homeTeam}</Text>
          </View>

          <View style={styles.scoreContainer}>
            {item.status === 'played' ? (
              <>
                <Text style={styles.score}>{item.homeScore}</Text>
                <Text style={styles.scoreDivider}>-</Text>
                <Text style={styles.score}>{item.awayScore}</Text>
              </>
            ) : (
              <Text style={styles.vsText}>VS</Text>
            )}
          </View>

          <View style={styles.teamContainer}>
            <View style={[styles.teamLogo, styles.teamLogoAway]}>
              <Text style={styles.teamLogoText}>{item.awayTeam.charAt(0)}</Text>
            </View>
            <Text style={styles.teamName}>{item.awayTeam}</Text>
          </View>
        </View>

        <View style={styles.matchInfo}>
          <Text style={styles.stadiumText}>📍 {item.stadium}</Text>
        </View>

        {/* Cards Section */}
        {item.status === 'played' && (
          <View style={styles.cardsContainer}>
            {cards.length > 0 ? (
              cards.map((card) => (
                <View key={card.id} style={styles.cardEvent}>
                  <View
                    style={[
                      styles.cardIndicator,
                      card.cardType === 'yellow' && styles.yellowCard,
                      card.cardType === 'red' && styles.redCard,
                    ]}
                  />
                  <Text style={styles.cardPlayer}>{card.playerName}</Text>
                  <Text style={styles.cardMinute}>{card.minute}'</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noCardsText}>No cards in this match</Text>
            )}
          </View>
        )}

        {/* Convoked Players Count */}
        {isUpcoming && (
          <View style={styles.convokedInfo}>
            <Text style={styles.convokedText}>
              {item.convokedPlayers?.length || 0} players convoked
            </Text>
            <Text style={styles.tapToEdit}>Tap to manage convocation</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[styles.filterText, filter === 'all' && styles.filterTextActive]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'upcoming' && styles.filterBtnActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text
            style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}
          >
            To Play
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'played' && styles.filterBtnActive]}
          onPress={() => setFilter('played')}
        >
          <Text
            style={[styles.filterText, filter === 'played' && styles.filterTextActive]}
          >
            Played
          </Text>
        </TouchableOpacity>
      </View>

      <SectionList
        sections={[
          {
            title: 'Upcoming Matches',
            data: filter === 'all' ? upcomingMatches : filter === 'upcoming' ? upcomingMatches : [],
            renderItem: renderMatchCard,
          },
          {
            title: 'Played Matches',
            data: filter === 'all' ? playedMatches : filter === 'played' ? playedMatches : [],
            renderItem: renderMatchCard,
          },
        ]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        SectionSeparatorComponent={() => <View style={styles.sectionSpacer} />}
      />
      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#212529',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchDate: {
    fontSize: 13,
    color: '#6C757D',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPlayed: {
    backgroundColor: '#E9ECEF',
  },
  statusUpcoming: {
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
  },
  statusLive: {
    backgroundColor: '#DC3545',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextPlayed: {
    color: '#6C757D',
  },
  statusTextUpcoming: {
    color: '#00AA30',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00FF41',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamLogoAway: {
    backgroundColor: '#212529',
  },
  teamLogoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212529',
  },
  scoreDivider: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ADB5BD',
    marginHorizontal: 10,
  },
  vsText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ADB5BD',
  },
  matchInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
    marginBottom: 12,
  },
  stadiumText: {
    fontSize: 13,
    color: '#6C757D',
  },
  cardsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
  },
  cardEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIndicator: {
    width: 12,
    height: 16,
    borderRadius: 2,
    marginRight: 10,
  },
  yellowCard: {
    backgroundColor: '#FFD700',
  },
  redCard: {
    backgroundColor: '#DC3545',
  },
  cardPlayer: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  cardMinute: {
    fontSize: 13,
    color: '#6C757D',
    fontWeight: '500',
  },
  noCardsText: {
    fontSize: 13,
    color: '#ADB5BD',
    fontStyle: 'italic',
  },
  convokedInfo: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  convokedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00AA30',
  },
  tapToEdit: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  sectionSpacer: {
    height: 20,
  },
});

