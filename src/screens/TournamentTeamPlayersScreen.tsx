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
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { usePlayers } from '../context/PlayerContext';
import { Team, Negotiation } from '../types/user';

export default function TournamentTeamPlayersScreen({ route, navigation }: any) {
  const { tournamentId, teamId } = route.params;
  const { tournaments, teams, negotiations, createNegotiation, respondToNegotiation } = useApp();
  const { players } = usePlayers();

  const tournament = tournaments.find((t) => t.id === tournamentId);
  const team = teams.find((t) => t.id === teamId);
  const teamPlayers = players.filter((p) => team?.playerIds.includes(p.id));

  const [negotiationModalVisible, setNegotiationModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<typeof teamPlayers[0] | null>(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [counterOfferModalVisible, setCounterOfferModalVisible] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);

  if (!tournament || !team) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Team or tournament not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isActiveTournament = tournament.status === 'Active' || tournament.status === 'Live';

  const handleNegotiate = (player: typeof teamPlayers[0]) => {
    setSelectedPlayer(player);
    setOfferAmount('');
    setNegotiationModalVisible(true);
  };

  const submitNegotiation = () => {
    if (!selectedPlayer || !offerAmount || parseInt(offerAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid offer amount');
      return;
    }

    createNegotiation({
      tournamentId: tournament.id,
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      playerPosition: selectedPlayer.position,
      playerAge: selectedPlayer.age,
      fromTeam: team.name,
      offeredAmount: parseInt(offerAmount),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    });

    setNegotiationModalVisible(false);
    Alert.alert(
      'Negotiation Sent!',
      `Your offer of €${parseInt(offerAmount).toLocaleString()} for ${selectedPlayer.name} has been sent. You'll receive a response soon.`
    );
  };

  const handleCounterOfferResponse = (negotiation: Negotiation) => {
    setSelectedNegotiation(negotiation);
    setCounterOfferModalVisible(true);
  };

  const acceptCounterOffer = () => {
    if (selectedNegotiation && selectedNegotiation.counterOfferAmount) {
      respondToNegotiation(selectedNegotiation.id, 'accepted');
      setCounterOfferModalVisible(false);
      Alert.alert(
        'Deal Accepted!',
        `You've successfully signed ${selectedNegotiation.playerName} for €${selectedNegotiation.counterOfferAmount.toLocaleString()}!`
      );
    }
  };

  const refuseOffer = (status: 'refused' | 'accepted') => {
    if (selectedNegotiation) {
      respondToNegotiation(selectedNegotiation.id, status);
      setCounterOfferModalVisible(false);
      if (status === 'accepted') {
        Alert.alert(
          'Deal Accepted!',
          `You've successfully signed ${selectedNegotiation.playerName} for €${selectedNegotiation.offeredAmount.toLocaleString()}!`
        );
      }
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount}`;
  };

  const getPlayerNegotiation = (playerId: string) => {
    return negotiations.find(
      (n) => n.playerId === playerId && n.tournamentId === tournamentId
    );
  };

  const renderPlayerItem = ({ item }: { item: typeof teamPlayers[0] }) => {
    const negotiation = getPlayerNegotiation(item.id);
    
    return (
      <View style={styles.playerCard}>
        <TouchableOpacity
          style={styles.playerInfo}
          onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id })}
          activeOpacity={0.8}
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.playerAvatar} />
          ) : (
            <View style={[styles.playerAvatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{item.name}</Text>
            <View style={styles.playerMeta}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.position}</Text>
              </View>
              <Text style={styles.playerNumber}>#{item.number}</Text>
            </View>
            <Text style={styles.playerStats}>
              {item.age} yrs • {item.nationality} • {item.height}
            </Text>
          </View>
        </TouchableOpacity>

        {isActiveTournament && (
          <>
            {negotiation ? (
              <TouchableOpacity
                style={[
                  styles.negotiateBtn,
                  negotiation.status === 'pending' && styles.pendingBtn,
                  negotiation.status === 'accepted' && styles.acceptedBtn,
                  negotiation.status === 'refused' && styles.refusedBtn,
                  negotiation.status === 'counter_offer' && styles.counterBtn,
                ]}
                onPress={() => {
                  if (negotiation.status === 'counter_offer') {
                    handleCounterOfferResponse(negotiation);
                  }
                }}
              >
                <Text style={styles.negotiateBtnText}>
                  {negotiation.status === 'pending' && '⏳ Pending'}
                  {negotiation.status === 'accepted' && '✓ Accepted'}
                  {negotiation.status === 'refused' && '✕ Refused'}
                  {negotiation.status === 'counter_offer' && '📩 Counter Offer'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.negotiateBtn}
                onPress={() => handleNegotiate(item)}
              >
                <Text style={styles.negotiateBtnText}>💰 Negotiate</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {team.name}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Team Banner */}
      <View style={styles.teamBanner}>
        <View style={styles.teamLogoContainer}>
          <Image source={{ uri: team.logo }} style={styles.teamLogo} />
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamStadium}>📍 {team.stadium}</Text>
          <View style={styles.tournamentBadge}>
            <Text style={styles.tournamentBadgeText}>{tournament.name}</Text>
          </View>
        </View>
      </View>

      {/* Active Tournament Banner */}
      {isActiveTournament && (
        <View style={styles.activeTournamentBanner}>
          <Text style={styles.activeTournamentText}>🏆 Active Tournament - Start Negotiating!</Text>
        </View>
      )}

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Team Squad</Text>
        <Text style={styles.sectionSubtitle}>{teamPlayers.length} Players</Text>
      </View>

      {/* Players List */}
      <FlatList
        data={teamPlayers}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No players in this team</Text>
          </View>
        }
      />

      {/* Negotiation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={negotiationModalVisible}
        onRequestClose={() => setNegotiationModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make an Offer</Text>
              <TouchableOpacity onPress={() => setNegotiationModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedPlayer && (
              <View style={styles.playerInfoCard}>
                <View style={styles.playerAvatarLarge}>
                  <Text style={styles.playerAvatarLargeText}>{selectedPlayer.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.playerInfoName}>{selectedPlayer.name}</Text>
                  <Text style={styles.playerInfoMeta}>
                    {selectedPlayer.position} • {selectedPlayer.age} yrs
                  </Text>
                  <Text style={styles.playerInfoTeam}>{team.name}</Text>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Offer Amount (€)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount (e.g., 50000000)"
                placeholderTextColor="#ADB5BD"
                keyboardType="number-pad"
                value={offerAmount}
                onChangeText={setOfferAmount}
              />
              <Text style={styles.hintText}>
                💡 Tip: Offer 10-20% above market value for better acceptance rate
              </Text>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={submitNegotiation}>
              <Text style={styles.submitBtnText}>Send Offer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Counter Offer Response Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={counterOfferModalVisible}
        onRequestClose={() => setCounterOfferModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Counter Offer Received!</Text>
            </View>

            {selectedNegotiation && (
              <>
                <View style={styles.counterOfferCard}>
                  <Text style={styles.counterPlayerName}>{selectedNegotiation.playerName}</Text>
                  <Text style={styles.counterPlayerPosition}>
                    {selectedNegotiation.playerPosition} • {selectedNegotiation.playerAge} yrs
                  </Text>
                  
                  <View style={styles.offerComparison}>
                    <View style={styles.offerItem}>
                      <Text style={styles.offerLabel}>Your Offer</Text>
                      <Text style={styles.offerValue}>
                        {formatCurrency(selectedNegotiation.offeredAmount)}
                      </Text>
                    </View>
                    <View style={styles.offerArrow}>→</View>
                    <View style={[styles.offerItem, styles.counterOfferHighlight]}>
                      <Text style={styles.offerLabel}>Their Demand</Text>
                      <Text style={[styles.offerValue, styles.counterValue]}>
                        {formatCurrency(selectedNegotiation.counterOfferAmount || 0)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.priceDifference}>
                    Difference: {formatCurrency((selectedNegotiation.counterOfferAmount || 0) - selectedNegotiation.offeredAmount)}
                  </Text>
                </View>

                <View style={styles.responseButtons}>
                  <TouchableOpacity
                    style={[styles.responseBtn, styles.refuseBtn]}
                    onPress={() => refuseOffer('refused')}
                  >
                    <Text style={styles.responseBtnText}>Refuse</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.responseBtn, styles.acceptBtn]}
                    onPress={acceptCounterOffer}
                  >
                    <Text style={styles.responseBtnText}>Accept</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.counterSubmitBtn}
                  onPress={() => {
                    respondToNegotiation(selectedNegotiation.id, 'counter_offer', (selectedNegotiation.counterOfferAmount || 0) * 1.1);
                    setCounterOfferModalVisible(false);
                    Alert.alert('Counter-Offer Sent', 'Your counter-offer has been sent to the club.');
                  }}
                >
                  <Text style={styles.counterSubmitBtnText}>
                    Make Counter-Offer ({formatCurrency(Math.round((selectedNegotiation.counterOfferAmount || 0) * 0.9))})
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: '#00FF41',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 60,
  },
  teamBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  teamLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  teamLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'contain',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  teamStadium: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  tournamentBadge: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  tournamentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  activeTournamentBanner: {
    backgroundColor: '#00FF41',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeTournamentText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
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
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  playerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: '#00FF41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '800',
    fontSize: 20,
    color: '#000',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#495057',
  },
  playerNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00FF41',
  },
  playerStats: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  negotiateBtn: {
    backgroundColor: '#00FF41',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  negotiateBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  pendingBtn: {
    backgroundColor: '#FFF3CD',
  },
  acceptedBtn: {
    backgroundColor: '#D4EDDA',
  },
  refusedBtn: {
    backgroundColor: '#F8D7DA',
  },
  counterBtn: {
    backgroundColor: '#CCE5FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  modalCloseText: {
    fontSize: 24,
    color: '#6C757D',
    fontWeight: '300',
  },
  playerInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  playerAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00FF41',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playerAvatarLargeText: {
    fontWeight: '800',
    fontSize: 24,
    color: '#000',
  },
  playerInfoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  playerInfoMeta: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  playerInfoTeam: {
    fontSize: 12,
    color: '#495057',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    textAlign: 'right',
  },
  hintText: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 8,
    fontStyle: 'italic',
  },
  submitBtn: {
    backgroundColor: '#00FF41',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
  counterOfferCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  counterPlayerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212529',
    textAlign: 'center',
  },
  counterPlayerPosition: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 4,
  },
  offerComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  offerItem: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    minWidth: 100,
  },
  counterOfferHighlight: {
    backgroundColor: '#00FF41',
  },
  offerLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  offerValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  counterValue: {
    color: '#000',
  },
  offerArrow: {
    fontSize: 24,
    color: '#6C757D',
    marginHorizontal: 16,
  },
  priceDifference: {
    fontSize: 14,
    color: '#DC3545',
    textAlign: 'center',
    fontWeight: '600',
  },
  responseButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  responseBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  refuseBtn: {
    backgroundColor: '#F8D7DA',
  },
  acceptBtn: {
    backgroundColor: '#D4EDDA',
  },
  responseBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  counterSubmitBtn: {
    backgroundColor: '#212529',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  counterSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
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
