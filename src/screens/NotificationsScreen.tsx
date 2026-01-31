import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'transfer' | 'tournament' | 'system';
  date: string;
  read: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Match Reminder',
    message: 'Real Madrid vs Barcelona starts in 2 hours',
    type: 'match',
    date: 'Today, 6:00 PM',
    read: false,
  },
  {
    id: '2',
    title: 'Transfer Complete',
    message: 'Mohamed Salah has been transferred to Barcelona',
    type: 'transfer',
    date: 'Today, 2:30 PM',
    read: false,
  },
  {
    id: '3',
    title: 'Tournament Update',
    message: 'Champions League final schedule has been updated',
    type: 'tournament',
    date: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    title: 'Player Convocation',
    message: 'You have convoked 5 players for the upcoming match',
    type: 'match',
    date: 'Yesterday',
    read: true,
  },
  {
    id: '5',
    title: 'Mercato Open',
    message: 'Winter Mercato 2024 is now open!',
    type: 'transfer',
    date: '2 days ago',
    read: true,
  },
  {
    id: '6',
    title: 'New Tournament',
    message: 'World Cup 2026 registration is now open',
    type: 'tournament',
    date: '3 days ago',
    read: true,
  },
  {
    id: '7',
    title: 'Match Results',
    message: 'Bayern Munich 3-1 Dortmund - Match completed',
    type: 'match',
    date: 'Last week',
    read: true,
  },
  {
    id: '8',
    title: 'System Update',
    message: 'TAK WIRA app has been updated to version 2.0',
    type: 'system',
    date: 'Last week',
    read: true,
  },
];

export default function NotificationsScreen() {

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match':
        return '⚽';
      case 'transfer':
        return '🔄';
      case 'tournament':
        return '🏆';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'match':
        return '#00FF41';
      case 'transfer':
        return '#FF9500';
      case 'tournament':
        return '#AF52DE';
      case 'system':
        return '#007AFF';
      default:
        return '#00FF41';
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: getTypeColor(item.type) + '20' }]}>
        <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {sampleNotifications.filter(n => !n.read).length} unread
          </Text>
        </View>

        <FlatList
          data={sampleNotifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <BottomNavBar />
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
  headerSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  notificationCard: {
    flexDirection: 'row',
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
  unreadCard: {
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#00FF41',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  typeIcon: {
    fontSize: 22,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212529',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF41',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 12,
    color: '#ADB5BD',
  },
});

