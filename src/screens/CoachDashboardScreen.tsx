import { useState } from 'react';
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
  Alert,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { usePlayers } from '../context/PlayerContext';
import BottomNavBar from '../components/BottomNavBar';
import { Tournament } from '../types/user';

export default function CoachDashboardScreen({ navigation }: any) {
  const { user, logout, tournaments, matches, teams, mercatos, transfers, addTournament, updateTournament, deleteTournament } = useApp();
  const { players } = usePlayers();
  const [showAddTournament, setShowAddTournament] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [newTournament, setNewTournament] = useState({
    name: '',
    teams: '',
    date: '',
    status: 'Upcoming' as const,
    image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=400&auto=format',
    description: '',
  });

  const handleAddTournament = () => {
    if (!newTournament.name.trim()) {
      Alert.alert('Error', 'Tournament name is required');
      return;
    }
    addTournament({
      ...newTournament,
      teams: parseInt(newTournament.teams) || 16,
      ownerId: user!.id,
    });
    setNewTournament({
      name: '',
      teams: '',
      date: '',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1518605348428-76e5a503557d?q=80&w=400&auto=format',
      description: '',
    });
    setShowAddTournament(false);
  };

  const handleUpdateTournament = () => {
    if (editingTournament) {
      updateTournament(editingTournament.id, editingTournament);
      setEditingTournament(null);
    }
  };

  const handleDeleteTournament = (id: string) => {
    Alert.alert(
      'Delete Tournament',
      'Are you sure you want to delete this tournament?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTournament(id),
        },
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount}`;
  };

  const renderTournamentItem = ({ item }: { item: Tournament }) => (
    <View style={styles.tournamentCard}>
      <Image source={{ uri: item.image }} style={styles.tournamentImage} />
      <View style={styles.tournamentOverlay} />
      <View style={styles.tournamentStatus}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <View style={styles.tournamentContent}>
        <Text style={styles.tournamentName}>{item.name}</Text>
        <View style={styles.tournamentMeta}>
          <Text style={styles.metaText}>{item.teams} Teams</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.tournamentActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => setEditingTournament(item)}
        >
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDeleteTournament(item.id)}
        >
          <Text style={styles.actionBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* My Team Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Team</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => navigation.navigate('Players')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.teamCard}>
              <View style={styles.teamAvatarContainer}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamAvatarText}>{players.length}</Text>
                </View>
                <View style={styles.teamBadge}>
                  <Text style={styles.teamBadgeText}>Active</Text>
                </View>
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>Team Roster</Text>
                <Text style={styles.teamCount}>{players.length} Players</Text>
                <View style={styles.teamPositions}>
                  <Text style={styles.positionText}>Click "View All" to manage</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.teamActionBtn}
                onPress={() => navigation.navigate('Players')}
              >
                <Text style={styles.teamActionText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* My Teams Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Teams</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => navigation.navigate('Teams')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.teamsGrid}>
              {teams.slice(0, 3).map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={styles.teamPreviewCard}
                  onPress={() => navigation.navigate('Teams')}
                >
                  <View style={styles.teamPreviewLogo}>
                    <Text style={styles.teamPreviewLogoText}>{team.shortName}</Text>
                  </View>
                  <Text style={styles.teamPreviewName}>{team.shortName}</Text>
                  <Text style={styles.teamPreviewStadium}>{team.stadium}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.teamsTapHint}>Tap to view teams and players</Text>
          </View>

          {/* My Tournaments Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Tournaments</Text>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => setShowAddTournament(!showAddTournament)}
              >
                <Text style={styles.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {/* Add Tournament Form */}
            {showAddTournament && (
              <View style={styles.addForm}>
                <Text style={styles.formTitle}>Add New Tournament</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Tournament Name"
                  placeholderTextColor="#ADB5BD"
                  value={newTournament.name}
                  onChangeText={(value) => setNewTournament({ ...newTournament, name: value })}
                />
                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Teams"
                    placeholderTextColor="#ADB5BD"
                    keyboardType="number-pad"
                    value={newTournament.teams}
                    onChangeText={(value) => setNewTournament({ ...newTournament, teams: value })}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Date (e.g. Jan - Mar)"
                    placeholderTextColor="#ADB5BD"
                    value={newTournament.date}
                    onChangeText={(value) => setNewTournament({ ...newTournament, date: value })}
                  />
                </View>
                <View style={styles.formRow}>
                  <TouchableOpacity
                    style={[styles.statusBtn, newTournament.status === 'Upcoming' && styles.statusBtnActive]}
                    onPress={() => setNewTournament({ ...newTournament, status: 'Upcoming' })}
                  >
                    <Text style={[styles.statusBtnText, newTournament.status === 'Upcoming' && styles.statusBtnTextActive]}>Upcoming</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusBtn, newTournament.status === 'Active' && styles.statusBtnActive]}
                    onPress={() => setNewTournament({ ...newTournament, status: 'Active' })}
                  >
                    <Text style={[styles.statusBtnText, newTournament.status === 'Active' && styles.statusBtnTextActive]}>Active</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusBtn, newTournament.status === 'Completed' && styles.statusBtnActive]}
                    onPress={() => setNewTournament({ ...newTournament, status: 'Completed' })}
                  >
                    <Text style={[styles.statusBtnText, newTournament.status === 'Completed' && styles.statusBtnTextActive]}>Completed</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={[styles.formBtn, styles.cancelFormBtn]}
                    onPress={() => setShowAddTournament(false)}
                  >
                    <Text style={styles.cancelFormBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.formBtn, styles.saveFormBtn]}
                    onPress={handleAddTournament}
                  >
                    <Text style={styles.saveFormBtnText}>Add Tournament</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Tournaments List */}
            {tournaments.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tournaments yet</Text>
                <Text style={styles.emptyStateSubtext}>Tap "+ Add" to create your first tournament</Text>
              </View>
            ) : (
              <FlatList
                data={tournaments}
                renderItem={renderTournamentItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.tournamentsList}
              />
            )}
          </View>

          {/* My Matches Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Matches</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => navigation.navigate('Matches')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.matchesSummary}>
              <View style={styles.matchStatCard}>
                <Text style={styles.matchStatNumber}>{matches.filter(m => m.status === 'played').length}</Text>
                <Text style={styles.matchStatLabel}>Played</Text>
              </View>
              <View style={styles.matchStatCard}>
                <Text style={[styles.matchStatNumber, styles.upcomingColor]}>{matches.filter(m => m.status === 'upcoming').length}</Text>
                <Text style={styles.matchStatLabel}>Upcoming</Text>
              </View>
              <View style={styles.matchStatCard}>
                <Text style={[styles.matchStatNumber, styles.liveColor]}>{matches.filter(m => m.status === 'live').length}</Text>
                <Text style={styles.matchStatLabel}>Live</Text>
              </View>
            </View>

            {/* Recent Matches */}
            {matches.slice(0, 2).map((match) => (
              <TouchableOpacity
                key={match.id}
                style={styles.matchPreviewCard}
                onPress={() => navigation.navigate('Matches')}
              >
                <View style={styles.matchPreviewHeader}>
                  <Text style={styles.matchPreviewDate}>{match.date}</Text>
                  <View style={[styles.matchStatusBadge, match.status === 'played' && styles.statusPlayed, match.status === 'upcoming' && styles.statusUpcoming]}>
                    <Text style={[styles.matchStatusText, match.status === 'played' && styles.statusTextPlayed]}>{match.status}</Text>
                  </View>
                </View>
                <View style={styles.matchPreviewTeams}>
                  <Text style={styles.matchPreviewTeam}>{match.homeTeam}</Text>
                  <Text style={styles.matchPreviewScore}>
                    {match.status === 'played' ? `${match.homeScore} - ${match.awayScore}` : 'VS'}
                  </Text>
                  <Text style={styles.matchPreviewTeam}>{match.awayTeam}</Text>
                </View>
                {match.status === 'upcoming' && (
                  <Text style={styles.tapToConvoke}>Tap to manage convocation</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* My Mercato Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Mercato</Text>
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => navigation.navigate('Mercato')}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mercatoSummaryCard}>
              <View style={styles.mercatoSummaryHeader}>
                <View style={styles.mercatoIconContainer}>
                  <Text style={styles.mercatoIcon}>🔄</Text>
                </View>
                <View style={styles.mercatoSummaryInfo}>
                  <Text style={styles.mercatoSummaryTitle}>Transfer Market</Text>
                  <Text style={styles.mercatoSummarySubtitle}>
                    {mercatos.length} active mercatos
                  </Text>
                </View>
              </View>

              <View style={styles.mercatoStatsRow}>
                <View style={styles.mercatoStatItem}>
                  <Text style={styles.mercatoStatNumber}>{transfers.length}</Text>
                  <Text style={styles.mercatoStatLabel}>Transfers</Text>
                </View>
                <View style={styles.mercatoStatDivider} />
                <View style={styles.mercatoStatItem}>
                  <Text style={[styles.mercatoStatNumber, styles.revenueColor]}>
                    {formatCurrency(transfers.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.transferFee, 0))}
                  </Text>
                  <Text style={styles.mercatoStatLabel}>Revenue</Text>
                </View>
                <View style={styles.mercatoStatDivider} />
                <View style={styles.mercatoStatItem}>
                  <Text style={styles.mercatoStatNumber}>
                    {mercatos.filter(m => m.status === 'active').length}
                  </Text>
                  <Text style={styles.mercatoStatLabel}>Active</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.mercatoActionBtn}
                onPress={() => navigation.navigate('Mercato')}
              >
                <Text style={styles.mercatoActionText}>Manage Mercato →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => {
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Edit Tournament Modal */}
      {editingTournament && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Tournament</Text>
            <TextInput
              style={styles.input}
              placeholder="Tournament Name"
              placeholderTextColor="#ADB5BD"
              value={editingTournament.name}
              onChangeText={(value) => setEditingTournament({ ...editingTournament, name: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              placeholderTextColor="#ADB5BD"
              value={editingTournament.date}
              onChangeText={(value) => setEditingTournament({ ...editingTournament, date: value })}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelModalBtn]}
                onPress={() => setEditingTournament(null)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveModalBtn]}
                onPress={handleUpdateTournament}
              >
                <Text style={styles.saveModalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  viewAllBtn: {
    padding: 8,
  },
  viewAllText: {
    color: '#00FF41',
    fontWeight: '700',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#212529',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamAvatarContainer: {
    marginRight: 16,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00FF41',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  teamBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#212529',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  teamBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  teamCount: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  teamPositions: {
    marginTop: 4,
  },
  positionText: {
    fontSize: 12,
    color: '#ADB5BD',
  },
  teamActionBtn: {
    backgroundColor: '#212529',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  teamActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  addForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: '#212529',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C757D',
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  formBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  cancelFormBtn: {
    backgroundColor: '#E9ECEF',
  },
  cancelFormBtnText: {
    color: '#495057',
    fontWeight: '700',
  },
  saveFormBtn: {
    backgroundColor: '#00FF41',
  },
  saveFormBtnText: {
    color: '#000000',
    fontWeight: '700',
  },
  tournamentsList: {
    gap: 12,
  },
  tournamentCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 12,
  },
  tournamentImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  tournamentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  tournamentStatus: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 255, 65, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tournamentContent: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
  },
  tournamentName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    color: '#E9ECEF',
    fontSize: 14,
    fontWeight: '500',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00FF41',
    marginHorizontal: 8,
  },
  tournamentActions: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
  },
  editBtn: {
    backgroundColor: '#212529',
  },
  deleteBtn: {
    backgroundColor: '#DC3545',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6C757D',
  },
  logoutBtn: {
    backgroundColor: '#DC3545',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginLeft: 10,
  },
  cancelModalBtn: {
    backgroundColor: '#E9ECEF',
  },
  cancelModalBtnText: {
    color: '#495057',
    fontWeight: '700',
  },
  saveModalBtn: {
    backgroundColor: '#00FF41',
  },
  saveModalBtnText: {
    color: '#000000',
    fontWeight: '700',
  },
  matchesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchStatCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  matchStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212529',
  },
  matchStatLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 4,
  },
  upcomingColor: {
    color: '#00AA30',
  },
  liveColor: {
    color: '#DC3545',
  },
  matchPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  matchPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchPreviewDate: {
    fontSize: 13,
    color: '#6C757D',
  },
  matchStatusBadge: {
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
  matchStatusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  statusTextPlayed: {
    color: '#6C757D',
  },
  matchPreviewTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchPreviewTeam: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  matchPreviewScore: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212529',
    paddingHorizontal: 16,
  },
  tapToConvoke: {
    fontSize: 12,
    color: '#00AA30',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  teamsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamPreviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  teamPreviewLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00FF41',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamPreviewLogoText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
  },
  teamPreviewName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
  },
  teamPreviewStadium: {
    fontSize: 11,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 4,
  },
  teamsTapHint: {
    fontSize: 12,
    color: '#00AA30',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  // Mercato styles
  mercatoSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mercatoSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mercatoIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00FF4115',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  mercatoIcon: {
    fontSize: 24,
  },
  mercatoSummaryInfo: {
    flex: 1,
  },
  mercatoSummaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212529',
  },
  mercatoSummarySubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  mercatoStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  mercatoStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  mercatoStatNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212529',
  },
  mercatoStatLabel: {
    fontSize: 11,
    color: '#6C757D',
    marginTop: 2,
  },
  mercatoStatDivider: {
    width: 1,
    height: 35,
    backgroundColor: '#E9ECEF',
  },
  revenueColor: {
    color: '#00AA30',
  },
  mercatoActionBtn: {
    backgroundColor: '#212529',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  mercatoActionText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

