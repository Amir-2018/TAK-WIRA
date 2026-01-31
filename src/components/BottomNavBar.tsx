import { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text, Alert, Animated, Dimensions } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Home, Users, Trophy, Bell, User as UserIcon } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width * 0.92;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;

export default function BottomNavBar() {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated } = useApp();

  // Get current route name
  const state = useNavigationState(state => state);
  const currentRoute = state?.routes[state.index]?.name;

  const animationValue = useRef(new Animated.Value(0)).current;

  const tabs = [
    { name: 'Home', icon: Home, route: 'Home' },
    { name: 'Players', icon: Users, route: 'Players' },
    { name: 'Center', isCenter: true },
    { name: 'Matches', icon: Trophy, route: 'Matches' },
    { name: 'Notifications', icon: Bell, route: 'Notifications' },
  ];

  const getActiveTabIdx = () => {
    const idx = tabs.findIndex(tab => tab.route === currentRoute);
    return idx === -1 ? 0 : idx;
  };

  useEffect(() => {
    const activeIdx = getActiveTabIdx();
    Animated.spring(animationValue, {
      toValue: activeIdx * TAB_WIDTH,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  }, [currentRoute]);

  const handlePress = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dock}>
        {/* Active Indicator Background */}
        <Animated.View
          style={[
            styles.activeIndicator,
            { transform: [{ translateX: animationValue }] }
          ]}
        />

        {tabs.map((tab) => {
          if (tab.isCenter) {
            return (
              <View key="center" style={styles.tabItem}>
                <TouchableOpacity
                  style={styles.avatarContainer}
                  onPress={() => {
                    if (isAuthenticated && user) {
                      if (user.role === 'coach') {
                        navigation.navigate('CoachDashboard');
                      } else {
                        Alert.alert('Profile', 'Player profile coming soon!');
                      }
                    } else {
                      navigation.navigate('Login');
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.avatarInner}>
                    {isAuthenticated && user ? (
                      user.avatar ? (
                        <Image source={{ uri: user.avatar }} style={styles.avatar} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                        </View>
                      )
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: '#E9ECEF' }]}>
                        <UserIcon size={24} color="#6C757D" />
                      </View>
                    )}
                    {isAuthenticated && <View style={styles.onlineStatus} />}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }

          const IconComponent = tab.icon!;
          const isActive = tab.route === currentRoute;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => handlePress(tab.route!)}
              activeOpacity={0.6}
            >
              <IconComponent
                size={22}
                color={isActive ? '#000' : '#ADB5BD'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {tab.name === 'Notifications' && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifText}>3</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dock: {
    width: TAB_BAR_WIDTH,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabItem: {
    width: TAB_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00FF41',
    left: (TAB_WIDTH - 50) / 2 + 5, // Offset by container padding
    zIndex: -1,
    opacity: 0.2,
  },
  avatarContainer: {
    marginTop: -40,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFF',
    padding: 4,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#00FF41',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#000',
    fontSize: 24,
    fontWeight: '800',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00FF41',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notifBadge: {
    position: 'absolute',
    top: 15,
    right: TAB_WIDTH / 2 - 20,
    backgroundColor: '#FF3B30',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  notifText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
});


