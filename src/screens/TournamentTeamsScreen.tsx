import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { usePlayers } from '../context/PlayerContext';
import { Tournament, Team } from '../types/user';

export default function TournamentTeamsScreen({ route, navigation }: any) {
  const { tournamentId } = route.params;
  const { tournaments, teams } = useApp();
  const { players } = usePlayers();

  const tournament = tournaments.find((t) => t.id === tournamentId);
  const tournamentTeams = teams.filter((team) => team.tournamentIds.includes(tournamentId));

  if (!tournament) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tournament not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderTeamItem = ({ item }: { item: Team }) => {
    const teamPlayers = players.filter((p) => item.playerIds.includes(p.id));
    
    return (
      <View style={styles.teamCard}>
        <TouchableOpacity
          style={styles.teamHeader}
          onPress={() => navigation.navigate('TournamentTeamPlayers', { 
            tournamentId: tournament.id,
            teamId: item.id 
          })}
          activeOpacity={0.8}
        >
          <View style={styles.teamLogoContainer}>
            <Image source={{ uri: item.logo }} style={styles.teamLogo} />
          </View>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.name}</Text>
            <Text style={styles.teamStadium}>📍 {item.stadium}</Text>
            <Text style={styles.teamCity}>{item.city} • Founded {item.founded}</Text>
          </View>
          <View style={styles.teamMeta}>
            <View style={styles.playerCountBadge}>
              <Text style={styles.playerCountText}>{teamPlayers.length}</Text>
              <Text style={styles.playerCountLabel}>Players</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
        
        {/* Preview of team players */}
        {teamPlayers.length > 0 && (
          <View style={styles.playersPreview}>
            <Text style={styles.playersPreviewTitle}>Players ({teamPlayers.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playersScroll}>
              {teamPlayers.slice(0, 5).map((player) => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerPreviewItem}
                  onPress={() => navigation.navigate('PlayerDetail', { playerId: player.id })}
                >
                  {player.image ? (
                    <Image source={{ uri: player.image }} style={styles.playerPreviewAvatar} />
                  ) : (
                    <View style={[styles.playerPreviewAvatar, styles.avatarPlaceholder]}>
                      <Text style={styles.playerPreviewAvatarText}>{player.name.charAt(0)}</Text>
                    </View>
                  )}
                  <Text style={styles.playerPreviewName} numberOfLines={1}>
                    {player.name}
                  </Text>
                  <Text style={styles.playerPreviewPosition}>{player.position}</Text>
                </TouchableOpacity>
              ))}
              {teamPlayers.length > 5 && (
                <TouchableOpacity
                  style={styles.viewMoreBtn}
                  onPress={() => navigation.navigate('TournamentTeamPlayers', { 
                    tournamentId: tournament.id,
                    teamId: item.id 
                  })}
                >
                  <Text style={styles.viewMoreText}>+{teamPlayers.length - 5} more</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Tournament Header */}
      <View style={styles.tournamentHeader}>
        <Image source={{ uri: tournament.image }} style={styles.tournamentImage} />
        <View style={styles.tournamentOverlay} />
        <View style={styles.tournamentHeaderContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
          
          <View style={styles.tournamentTitleContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{tournament.status}</Text>
            </View>
            <Text style={styles.tournamentName}>{tournament.name}</Text>
            <Text style={styles.tournamentMeta}>
              {tournament.teams} Teams • {tournament.date}
            </Text>
          </View>
        </View>
      </View>

      {/* Teams List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Participating Teams</Text>
        <Text style={styles.sectionSubtitle}>{tournamentTeams.length} Teams</Text>
      </View>

      <FlatList
        data={tournamentTeams}
        renderItem={renderTeamItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No teams in this tournament</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tournamentHeader: {
    height: 200,
    position: 'relative',
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tournamentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tournamentHeaderContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingTop: 40,
  },
  backBtn: {
    marginBottom: 12,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tournamentTitleContainer: {
    marginTop: 20,
  },
  statusBadge: {
    backgroundColor: 'rgba(0, 255, 65, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tournamentName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  tournamentMeta: {
    color: '#E9ECEF',
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  teamLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  teamStadium: {
    fontSize: 13,
    color: '#6C757D',
    marginTop: 2,
  },
  teamCity: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 2,
  },
  teamMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerCountBadge: {
    backgroundColor: '#00FF41',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  playerCountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  playerCountLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },
  arrow: {
    fontSize: 24,
    color: '#ADB5BD',
    fontWeight: '300',
  },
  playersPreview: {
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  playersPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  playersScroll: {
    paddingRight: 16,
  },
  playerPreviewItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  playerPreviewAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 6,
  },
  avatarPlaceholder: {
    backgroundColor: '#00FF41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerPreviewAvatarText: {
    fontWeight: '800',
    fontSize: 18,
    color: '#000',
  },
  playerPreviewName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    width: 70,
  },
  playerPreviewPosition: {
    fontSize: 10,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 2,
  },
  viewMoreBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 70,
  },
  viewMoreText: {
    fontSize: 12,
    color: '#00FF41',
    fontWeight: '600',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6C757D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#DC3545',
  },
});
