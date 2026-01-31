import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Transfer } from '../types/user';

export default function MercatoDetailScreen({ route, navigation }: any) {
  const { mercatoId } = route.params;
  const { mercatos, tournaments, transfers, teams, addTransfer, updateTransferStatus, deleteTransfer, players } = useApp();
  
  const mercato = mercatos.find((m) => m.id === mercatoId);
  const tournament = tournaments.find((t) => t.id === mercato?.tournamentId);
  
  const [showAddTransferModal, setShowAddTransferModal] = useState(false);
  const [newTransfer, setNewTransfer] = useState({
    playerId: '',
    playerName: '',
    fromTeam: '',
    toTeam: '',
    transferFee: '',
    playerPosition: '',
    playerAge: '',
  });

  if (!mercato) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Mercato not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const mercatoTransfers = transfers.filter((t) => t.mercatoId === mercatoId);
  const completedTransfers = mercatoTransfers.filter((t) => t.status === 'completed');
  const pendingTransfers = mercatoTransfers.filter((t) => t.status === 'pending');
  const totalRevenue = completedTransfers.reduce((sum, t) => sum + t.transferFee, 0);

  const getStatusColor = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return '#00AA30';
      case 'pending':
        return '#FF9500';
      case 'cancelled':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(0)}K`;
    }
    return `€${amount}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleAddTransfer = () => {
    if (!newTransfer.playerName.trim()) {
      Alert.alert('Error', 'Player name is required');
      return;
    }
    if (!newTransfer.fromTeam || !newTransfer.toTeam) {
      Alert.alert('Error', 'Please select both teams');
      return;
    }
    if (!newTransfer.transferFee) {
      Alert.alert('Error', 'Transfer fee is required');
      return;
    }

    addTransfer({
      mercatoId,
      playerId: newTransfer.playerId || Date.now().toString(),
      playerName: newTransfer.playerName,
      fromTeam: newTransfer.fromTeam,
      toTeam: newTransfer.toTeam,
      transferFee: parseInt(newTransfer.transferFee) || 0,
      status: 'pending',
      transferDate: new Date().toISOString().split('T')[0],
      playerPosition: newTransfer.playerPosition,
      playerAge: newTransfer.playerAge ? parseInt(newTransfer.playerAge) : undefined,
    });

    setShowAddTransferModal(false);
    setNewTransfer({
      playerId: '',
      playerName: '',
      fromTeam: '',
      toTeam: '',
      transferFee: '',
      playerPosition: '',
      playerAge: '',
    });
  };

  const handleUpdateStatus = (transfer: Transfer, newStatus: Transfer['status']) => {
    updateTransferStatus(transfer.id, newStatus);
  };

  const handleDeleteTransfer = (transfer: Transfer) => {
    Alert.alert(
      'Delete Transfer',
      `Are you sure you want to remove ${transfer.playerName} from the transfer list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransfer(transfer.id),
        },
      ]
    );
  };

  const renderTransferItem = ({ item }: { item: Transfer }) => (
    <View style={styles.transferCard}>
      <View style={styles.transferHeader}>
        <View style={styles.playerInfo}>
          <View style={styles.playerAvatar}>
            <Text style={styles.playerAvatarText}>{item.playerName.charAt(0)}</Text>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{item.playerName}</Text>
            <Text style={styles.playerMeta}>
              {item.playerPosition} • {item.playerAge} years
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.transferRoute}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamLabel}>From</Text>
          <Text style={styles.teamName}>{item.fromTeam}</Text>
        </View>
        <View style={styles.transferArrow}>
          <Text style={styles.transferArrowText}>→</Text>
          <Text style={styles.transferFee}>{formatCurrency(item.transferFee)}</Text>
        </View>
        <View style={styles.teamInfo}>
          <Text style={styles.teamLabel}>To</Text>
          <Text style={styles.teamName}>{item.toTeam}</Text>
        </View>
      </View>

      <Text style={styles.transferDate}>Transfer Date: {formatDate(item.transferDate)}</Text>

      {mercato.status === 'active' && (
        <View style={styles.transferActions}>
          {item.status === 'pending' && (
            <>
              <TouchableOpacity
                style={[styles.actionBtn, styles.completeBtn]}
                onPress={() => handleUpdateStatus(item, 'completed')}
              >
                <Text style={styles.completeBtnText}>Complete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.cancelBtn]}
                onPress={() => handleUpdateStatus(item, 'cancelled')}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDeleteTransfer(item)}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {mercato.name}
        </Text>
      </View>

      {/* Mercato Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>{tournament?.name}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  mercato.status === 'active'
                    ? '#00AA3020'
                    : mercato.status === 'upcoming'
                    ? '#FF950020'
                    : '#6C757D20',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    mercato.status === 'active'
                      ? '#00AA30'
                      : mercato.status === 'upcoming'
                      ? '#FF9500'
                      : '#6C757D',
                },
              ]}
            >
              {mercato.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.summaryDates}>
          <Text style={styles.dateRange}>
            📅 {formatDate(mercato.startDate)} → {formatDate(mercato.endDate)}
          </Text>
        </View>

        <View style={styles.summaryStats}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{mercatoTransfers.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, styles.completedColor]}>{completedTransfers.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, styles.pendingColor]}>{pendingTransfers.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, styles.revenueColor]}>{formatCurrency(totalRevenue)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>
      </View>

      {/* Transfers List */}
      <View style={styles.transfersSection}>
        <Text style={styles.sectionTitle}>Transfers ({mercatoTransfers.length})</Text>
        
        {mercatoTransfers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transfers yet</Text>
            <Text style={styles.emptyStateSubtext}>
              {mercato.status === 'active'
                ? 'Tap "+ Add Transfer" to record a player transfer'
                : 'This mercato has no recorded transfers'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={mercatoTransfers}
            renderItem={renderTransferItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.transfersList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Add Transfer Button */}
      {mercato.status === 'active' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddTransferModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Transfer</Text>
        </TouchableOpacity>
      )}

      {/* Add Transfer Modal */}
      <Modal
        visible={showAddTransferModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddTransferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Transfer</Text>
              <TouchableOpacity onPress={() => setShowAddTransferModal(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Player Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Kylian Mbappé"
              placeholderTextColor="#ADB5BD"
              value={newTransfer.playerName}
              onChangeText={(value) =>
                setNewTransfer({ ...newTransfer, playerName: value })
              }
            />

            <Text style={styles.inputLabel}>Position</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Forward"
              placeholderTextColor="#ADB5BD"
              value={newTransfer.playerPosition}
              onChangeText={(value) =>
                setNewTransfer({ ...newTransfer, playerPosition: value })
              }
            />

            <View style={styles.row}>
              <View style={[styles.halfWidth]}>
                <Text style={styles.inputLabel}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Years"
                  placeholderTextColor="#ADB5BD"
                  keyboardType="number-pad"
                  value={newTransfer.playerAge}
                  onChangeText={(value) =>
                    setNewTransfer({ ...newTransfer, playerAge: value })
                  }
                />
              </View>
              <View style={[styles.halfWidth]}>
                <Text style={styles.inputLabel}>Transfer Fee *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="€ Amount"
                  placeholderTextColor="#ADB5BD"
                  keyboardType="number-pad"
                  value={newTransfer.transferFee}
                  onChangeText={(value) =>
                    setNewTransfer({ ...newTransfer, transferFee: value })
                  }
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>From Team</Text>
            <View style={styles.pickerContainer}>
              {teams.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={[
                    styles.pickerOption,
                    newTransfer.fromTeam === team.name && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setNewTransfer({ ...newTransfer, fromTeam: team.name })}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      newTransfer.fromTeam === team.name && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {team.shortName} - {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>To Team</Text>
            <View style={styles.pickerContainer}>
              {teams.map((team) => (
                <TouchableOpacity
                  key={team.id}
                  style={[
                    styles.pickerOption,
                    newTransfer.toTeam === team.name && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setNewTransfer({ ...newTransfer, toTeam: team.name })}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      newTransfer.toTeam === team.name && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {team.shortName} - {team.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleAddTransfer}>
              <Text style={styles.createButtonText}>Add Transfer</Text>
            </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#DC3545',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  backBtnText: {
    fontSize: 16,
    color: '#00FF41',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212529',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  summaryDates: {
    marginBottom: 16,
  },
  dateRange: {
    fontSize: 14,
    color: '#6C757D',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  statLabel: {
    fontSize: 11,
    color: '#6C757D',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E9ECEF',
  },
  completedColor: {
    color: '#00AA30',
  },
  pendingColor: {
    color: '#FF9500',
  },
  revenueColor: {
    color: '#00FF41',
  },
  transfersSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  transfersList: {
    paddingBottom: 100,
  },
  transferCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00FF41',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerAvatarText: {
    fontSize: 20,
    fontWeight: '800',
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
    fontSize: 13,
    color: '#6C757D',
    marginTop: 2,
  },
  transferRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  teamInfo: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 11,
    color: '#6C757D',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  transferArrow: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  transferArrowText: {
    fontSize: 20,
    color: '#00FF41',
    marginBottom: 4,
  },
  transferFee: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00AA30',
  },
  transferDate: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 12,
  },
  transferActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 12,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  completeBtn: {
    backgroundColor: '#00AA30',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBtn: {
    backgroundColor: '#FF950020',
  },
  cancelBtnText: {
    color: '#FF9500',
    fontWeight: '700',
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: '#FFE5E5',
  },
  deleteBtnText: {
    color: '#DC3545',
    fontWeight: '700',
    fontSize: 13,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: '#00FF41',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#495057',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '85%',
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
  closeText: {
    fontSize: 24,
    color: '#6C757D',
    padding: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
    marginTop: 8,
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
  },
  pickerContainer: {
    marginBottom: 8,
  },
  pickerOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  pickerOptionSelected: {
    backgroundColor: '#00FF4115',
    borderColor: '#00FF41',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#495057',
  },
  pickerOptionTextSelected: {
    fontWeight: '700',
    color: '#00AA30',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  createButton: {
    backgroundColor: '#00FF41',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
});

