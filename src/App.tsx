import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerProvider } from './context/PlayerContext';
import { AppProvider } from './context/AppContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CoachDashboardScreen from './screens/CoachDashboardScreen';
import PlayersScreen from './screens/PlayersScreen';
import PlayerFormScreen from './screens/PlayerFormScreen';
import MatchesScreen from './screens/MatchesScreen';
import ConvocationScreen from './screens/ConvocationScreen';
import TeamsScreen from './screens/TeamsScreen';
import TeamPlayersScreen from './screens/TeamPlayersScreen';
import PlayerDetailScreen from './screens/PlayerDetailScreen';
import TournamentTeamsScreen from './screens/TournamentTeamsScreen';
import TournamentTeamPlayersScreen from './screens/TournamentTeamPlayersScreen';
import MercatoScreen from './screens/MercatoScreen';
import MercatoDetailScreen from './screens/MercatoDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <PlayerProvider>
        <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F8F9FA',
            },
            headerTitleStyle: {
              fontWeight: '800',
              fontSize: 20,
            },
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={({ navigation }) => ({
              title: 'TAK WIRA',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={{
                    backgroundColor: '#00FF41',
                    paddingHorizontal: 15,
                    paddingVertical: 6,
                    borderRadius: 15,
                  }}
                >
                  <Text style={{ color: '#000', fontWeight: '700', fontSize: 13 }}>LOGIN</Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CoachDashboard"
            component={CoachDashboardScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Players"
            component={PlayersScreen}
            options={{
              title: 'Team Roster',
              headerStyle: {
                backgroundColor: '#F8F9FA',
              },
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 20,
              },
            }}
          />
          <Stack.Screen
            name="PlayerForm"
            component={PlayerFormScreen}
            options={{
              title: 'Player Form',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Matches"
            component={MatchesScreen}
            options={{
              title: 'Matches',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 20,
              },
            }}
          />
          <Stack.Screen
            name="Convocation"
            component={ConvocationScreen}
            options={{
              title: 'Convocation',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Teams"
            component={TeamsScreen}
            options={{
              title: 'Teams',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 20,
              },
            }}
          />
          <Stack.Screen
            name="TeamPlayers"
            component={TeamPlayersScreen}
            options={{
              title: 'Team Players',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="PlayerDetail"
            component={PlayerDetailScreen}
            options={{
              title: 'Player Details',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="TournamentTeams"
            component={TournamentTeamsScreen}
            options={{
              title: 'Tournament Teams',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="TournamentTeamPlayers"
            component={TournamentTeamPlayersScreen}
            options={{
              title: 'Team Players',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
            }}
          />
          <Stack.Screen
            name="Mercato"
            component={MercatoScreen}
            options={{
              title: 'Mercato Dashboard',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '800',
                fontSize: 20,
              },
            }}
          />
          <Stack.Screen
            name="MercatoDetail"
            component={MercatoDetailScreen}
            options={{
              title: 'Mercato Details',
              headerStyle: {
                backgroundColor: '#FFFFFF',
              },
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
            }}
          />
        </Stack.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </AppProvider>
  );
}

