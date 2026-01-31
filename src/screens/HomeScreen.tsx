import { useApp } from '../context/AppContext';
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

export default function HomeScreen({ navigation }: any) {
    const { user, isAuthenticated, tournaments } = useApp();

    const renderItem = ({ item }: { item: typeof tournaments[0] }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TournamentTeams', { tournamentId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
                <Text style={styles.tournamentName}>{item.name}</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.detailText}>{item.teams} Teams</Text>
                    <View style={styles.dot} />
                    <Text style={styles.detailText}>{item.date}</Text>
                </View>
            </View>
            <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>Tap to view teams</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header with User Avatar */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.headerTitle}>{isAuthenticated && user ? user.name : 'Guest'}</Text>
                </View>
                {isAuthenticated && user ? (
                    <TouchableOpacity
                        style={styles.avatarBtn}
                        onPress={() => navigation.navigate('CoachDashboard')}
                    >
                        {user.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginBtnText}>Login</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                    {['All', 'Major', 'National', 'Youth', 'Friendly'].map((cat, idx) => (
                        <TouchableOpacity key={cat} style={[styles.categoryBtn, idx === 0 && styles.activeCategoryBtn]}>
                            <Text style={[styles.categoryText, idx === 0 && styles.activeCategoryText]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={tournaments}
                renderItem={renderItem}
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    welcomeText: {
        fontSize: 14,
        color: '#6C757D',
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#212529',
    },
    avatarBtn: {
        marginLeft: 12,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
    avatarPlaceholder: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#00FF41',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontWeight: '700',
        fontSize: 18,
        color: '#000',
    },
    loginBtn: {
        backgroundColor: '#00FF41',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    loginBtnText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 14,
    },
    categoryContainer: {
        marginVertical: 15,
    },
    categoryScroll: {
        paddingHorizontal: 20,
    },
    categoryBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E9ECEF',
        marginRight: 10,
    },
    activeCategoryBtn: {
        backgroundColor: '#212529',
    },
    categoryText: {
        color: '#6C757D',
        fontWeight: '600',
    },
    activeCategoryText: {
        color: '#FFF',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    cardContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    tournamentName: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    detailText: {
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
    statusBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0, 255, 65, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        zIndex: 1,
    },
    statusText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    tapHint: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tapHintText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
});

