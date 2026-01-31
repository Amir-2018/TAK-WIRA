import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Mercato } from '../types/user';

export default function MercatoScreen({ navigation }: any) {
  const { user, mercatos, tournaments, transfers, addMercato, deleteMercato } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMercato, setNewMercato] = useState({
    name: '',
    tournamentId: '',
    startDate: '',
    endDate: '',
    maxTransfers: '5',
  });

  const getTournamentName = (tournamentId: string) => {
    const tournament = tournaments.find((t) => t.id === tournamentId);
    return tournament?.name || 'Unknown Tournament';
  };

  const getMercatoTransfers = (mercatoId: string) => {
    return transfers.filter((t) => t.mercatoId === mercatoId);
  };

  const getMercatoRevenue = (mercatoId: string) => {
    const mercatoTransfers = getMercatoTransfers(mercatoId);
    return mercatoTransfers
      .filter((t) => t.status === 'completed')
      .reduce((sum, t) => sum + t.transferFee, 0);
  };

  const getStatusColor = (status: Mercato['status']) => {
    switch (status) {
      case 'active':
        return '#00AA30';
      case 'upcoming':
        return '#FF9500';
      case 'closed':
        return '#6C757D';
      default:
        return '#6C757D';
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

  const handleAddMercato = () => {
    if (!newMercato.name.trim()) {
      Alert.alert('Error', 'Mercato name is required');
      return;
    }
    if (!newMercato.tournamentId) {
      Alert.alert('Error', 'Please select a tournament');
      return;
    }
    if (!newMercato.startDate || !newMercato.endDate) {
      Alert.alert('Error', 'Start and end dates are required');
      return;
    }

    addMercato({
      tournamentId: newMercato.tournamentId,
      name: newMercato.name,
      startDate: newMercato.startDate,
      endDate: newMercato.endDate,
      maxTransfers: parseInt(newMercato.maxTransfers) || 5,
      status: 'upcoming',
      ownerId: user!.id,
      createdAt: new Date().toISOString().split('T')[0],
    });

    setShowAddModal(false);
    setNewMercato({
      name: '',
      tournamentId: '',
      startDate: '',
      endDate: '',
      maxTransfers: '5',
    });
  };

  const handleDeleteMercato = (mercato: Mercato) => {
    Alert.alert(
      'Delete Mercato',
      `Are you sure you want to delete "${mercato.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMercato(mercato.id),
        },
      ]
    );
  };

  const renderMercatoItem = ({ item }: { item: Mercato }) => {
    const mercatoTransfers = getMercatoTransfers(item.id);
    const completedTransfers = mercatoTransfers.filter((t) => t.status === 'completed');
    const revenue = getMercatoRevenue(item.id);

    return (
      <View style={styles.mercatoCard}>
        <View style={styles.mercatoHeader}>
          <View style={styles.mercatoInfo}>
            <Text style={styles.mercatoName}>{item.name}</Text>
            <Text style={styles.tournamentName}>{getTournamentName(item.tournamentId)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.mercatoDates}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Start</Text>
            <Text style={styles.dateValue}>{item.startDate}</Text>
          </View>
          <View style={styles.dateArrow}>
            <Text style={styles.dateArrowText}>→</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>End</Text>
            <Text style={styles.dateValue}>{item.endDate}</Text>
          </View>
        </View>

        <View style={styles.mercatoStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mercatoTransfers.length}</Text>
            <Text style={styles.statLabel}>Transfers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedTransfers.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, styles.revenueText]}>{formatCurrency(revenue)}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min((mercatoTransfers.length / item.maxTransfers) * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {mercatoTransfers.length} / {item.maxTransfers} transfers used
        </Text>

        <View style={styles.mercatoActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.viewBtn]}
            onPress={() => navigation.navigate('MercatoDetail', { mercatoId: item.id })}
          >
            <Text style={styles.viewBtnText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDeleteMercato(item)}
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mercato Dashboard</Text>
        <Text style={styles.headerSubtitle}>Transfer Market Management</Text>
      </View>

      <FlatList
        data={mercatos}
        renderItem={renderMercatoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No mercatos yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap "+ Create Mercato" to start the transfer window
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Create Mercato</Text>
      </TouchableOpacity>

      {/* Add Mercato Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Mercato</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Mercato Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Winter Mercato 2024"
              placeholderTextColor="#ADB5BD"
              value={newMercato.name}
              onChangeText={(value) => setNewMercato({ ...newMercato, name: value })}
            />

            <Text style={styles.inputLabel}>Tournament</Text>
            <View style={styles.pickerContainer}>
              {tournaments.map((tournament) => (
                <TouchableOpacity
                  key={tournament.id}
                  style={[
                    styles.pickerOption,
                    newMercato.tournamentId === tournament.id && styles.pickerOptionSelected,
                  ]}
                  onPress={() => setNewMercato({ ...newMercato, tournamentId: tournament.id })}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      newMercato.tournamentId === tournament.id && styles.pickerOptionTextSelected,
                    ]}
                  >
                    {tournament.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.dateRow}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#ADB5BD"
                  value={newMercato.startDate}
                  onChangeText={(value) => setNewMercato({ ...newMercato, startDate: value })}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#ADB5BD"
                  value={newMercato.endDate}
                  onChangeText={(value) => setNewMercato({ ...newMercato, endDate: value })}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Max Transfers</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor="#ADB5BD"
              keyboardType="number-pad"
              value={newMercato.maxTransfers}
              onChangeText={(value) => setNewMercato({ ...newMercato, maxTransfers: value })}
            />

            <TouchableOpacity style={styles.createButton} onPress={handleAddMercato}>
              <Text style={styles.createButtonText}>Create Mercato</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  mercatoCard: {
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
  mercatoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mercatoInfo: {
    flex: 1,
  },
  mercatoName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
  },
  tournamentName: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  mercatoDates: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  dateItem: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  dateArrow: {
    paddingHorizontal: 16,
  },
  dateArrowText: {
    fontSize: 18,
    color: '#6C757D',
  },
  mercatoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E9ECEF',
  },
  revenueText: {
    color: '#00AA30',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00FF41',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 16,
  },
  mercatoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  viewBtn: {
    backgroundColor: '#212529',
  },
  viewBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: '#FFE5E5',
  },
  deleteBtnText: {
    color: '#DC3545',
    fontWeight: '700',
    fontSize: 14,
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
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  pickerOptionSelected: {
    backgroundColor: '#00FF4115',
    borderColor: '#00FF41',
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#495057',
  },
  pickerOptionTextSelected: {
    fontWeight: '700',
    color: '#00AA30',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  createButton: {
    backgroundColor: '#00FF41',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
  },
});

