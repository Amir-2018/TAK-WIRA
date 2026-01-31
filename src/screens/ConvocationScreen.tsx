import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { usePlayers } from '../context/PlayerContext';
import { Match, Player } from '../types/user';

export default function ConvocationScreen({ route, navigation }: any) {
  const { matchId } = route.params;
  const { matches, updateMatchConvokedPlayers } = useApp();
  const { players } = usePlayers();
  
  const match = matches.find((m) => m.id === matchId);
  const [convokedPlayerIds, setConvokedPlayerIds] = useState<string[]>([]);

  useEffect(() => {
    if (match?.convokedPlayers) {
      setConvokedPlayerIds(match.convokedPlayers);
    }
  }, [match]);

  if (!match) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Match not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const togglePlayerConvocation = (playerId: string) => {
    setConvokedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const handleSave = () => {
    updateMatchConvokedPlayers(matchId, convokedPlayerIds);
    navigation.goBack();
  };

  const renderPlayerItem = ({ item }: { item: Player }) => {
    const isConvoked = convokedPlayerIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.playerCard, isConvoked && styles.playerCardConvoked]}
        onPress={() => togglePlayerConvocation(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.playerInfo}>
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
              {item.age} yrs • {item.nationality}
            </Text>
          </View>
        </View>
        <View style={[styles.checkbox, isConvoked && styles.checkboxChecked]}>
          {isConvoked && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Convocation</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.matchInfo}>
        <Text style={styles.matchTitle}>
          {match.homeTeam} vs {match.awayTeam}
        </Text>
        <Text style={styles.matchDate}>
          {match.date} at {match.time}
        </Text>
        <Text style={styles.convokedCount}>
          {convokedPlayerIds.length} / {players.length} players selected
        </Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendUnselected]} />
          <Text style={styles.legendText}>Not Convocated</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendSelected]} />
          <Text style={styles.legendText}>Convocated</Text>
        </View>
      </View>

      <FlatList
        data={players}
        renderItem={renderPlayerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  cancelBtn: {
    padding: 8,
  },
  cancelText: {
    color: '#6C757D',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  saveBtn: {
    padding: 8,
  },
  saveText: {
    color: '#00FF41',
    fontSize: 16,
    fontWeight: '700',
  },
  matchInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    alignItems: 'center',
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
  },
  matchDate: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  convokedCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00FF41',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    marginRight: 8,
  },
  legendSelected: {
    backgroundColor: '#00FF41',
    borderColor: '#00FF41',
  },
  legendUnselected: {
    backgroundColor: 'transparent',
  },
  legendText: {
    fontSize: 13,
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
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  playerCardConvoked: {
    borderColor: '#00FF41',
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#00FF41',
    borderColor: '#00FF41',
  },
  checkmark: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
  },
});

