import { useState } from 'react';
import { useApp } from '../context/AppContext';
import BottomNavBar from '../components/BottomNavBar';
import FootballPitch from '../components/FootballPitch';
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
    ScrollView,
} from 'react-native';
import { Trophy, Star, Calendar, Clock, MapPin, Users as UsersIcon, ChevronRight, X, ShieldCheck, ListFilter } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
    const { tournaments, matches, teams } = useApp();
    const [activeTab, setActiveTab] = useState<'tournaments' | 'matches'>('tournaments');
    const [selectedMatch, setSelectedMatch] = useState<any>(null);
    const [showFormationModal, setShowFormationModal] = useState(false);
    const [selectedTeamAgenda, setSelectedTeamAgenda] = useState<any>(null);
    const [selectedTournament, setSelectedTournament] = useState<any>(null);

    const today = new Date().toISOString().split('T')[0];
    const todayMatches = matches.filter(m => m.date === today);

    const handleTeamPress = (teamName: string) => {
        const team = teams.find(t => t.name === teamName);
        if (team) {
            setSelectedTeamAgenda(team);
        }
    };

    const renderTournament = ({ item }: { item: typeof tournaments[0] }) => {
        const isCompleted = item.status === 'Completed' && item.results;

        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={[styles.card, isCompleted && styles.completedCard]}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('TournamentTeams', { tournamentId: item.id })}
                >
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <View style={[styles.statusBadge, item.status === 'Completed' && styles.completedBadge]}>
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
                    {!isCompleted && (
                        <View style={styles.tapHint}>
                            <Text style={styles.tapHintText}>Tap to view teams</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {item.status !== 'Completed' && (
                    <TouchableOpacity
                        style={styles.tournamentAgendaButton}
                        onPress={() => setSelectedTournament(item)}
                    >
                        <ListFilter size={16} color="#00FF41" />
                        <Text style={styles.tournamentAgendaButtonText}>Agenda & Referees</Text>
                    </TouchableOpacity>
                )}

                {isCompleted && item.results && (
                    <View style={styles.resultsContainer}>
                        <View style={styles.resultsHeader}>
                            <Trophy size={18} color="#FFD700" />
                            <Text style={styles.resultsTitle}>Tournament Results</Text>
                        </View>

                        <View style={styles.resultsGrid}>
                            {/* Winner & Top Scorer */}
                            <View style={styles.topPerformers}>
                                <TouchableOpacity
                                    style={styles.performerCard}
                                    onPress={() => handleTeamPress(item.results!.winner.teamName)}
                                >
                                    <View style={[styles.performerIcon, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
                                        <Trophy size={20} color="#FFD700" />
                                    </View>
                                    <View>
                                        <Text style={styles.performerLabel}>Winner</Text>
                                        <Text style={styles.performerName}>{item.results.winner.teamName}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.performerCard}>
                                    <View style={[styles.performerIcon, { backgroundColor: 'rgba(0, 255, 65, 0.1)' }]}>
                                        <Star size={20} color="#00FF41" />
                                    </View>
                                    <View>
                                        <Text style={styles.performerLabel}>Top Scorer</Text>
                                        <Text style={styles.performerName}>{item.results.topScorer.playerName}</Text>
                                        <Text style={styles.performerSubtext}>{item.results.topScorer.goals} goals</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Podium / Rankings */}
                            <View style={styles.rankingsRow}>
                                {item.results.rankings.sort((a, b) => a.rank - b.rank).map((rank) => (
                                    <TouchableOpacity
                                        key={rank.rank}
                                        style={styles.rankItem}
                                        onPress={() => handleTeamPress(rank.teamName)}
                                    >
                                        <View style={[styles.rankBadge,
                                        rank.rank === 1 ? styles.rank1 :
                                            rank.rank === 2 ? styles.rank2 : styles.rank3
                                        ]}>
                                            <Text style={styles.rankText}>{rank.rank}</Text>
                                        </View>
                                        <Image source={{ uri: rank.logo }} style={styles.rankLogo} />
                                        <Text style={styles.rankTeamName} numberOfLines={1}>{rank.teamName}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderMatch = ({ item }: { item: typeof matches[0] }) => (
        <View style={styles.matchCard}>
            <View style={styles.matchTimeHeader}>
                <Clock size={14} color="#6C757D" />
                <Text style={styles.matchTimeText}>{item.time}</Text>
                <View style={[styles.matchStatusPill, item.status === 'live' && styles.liveMatchPill]}>
                    <Text style={[styles.matchStatusText, item.status === 'live' && styles.liveMatchText]}>
                        {item.status === 'live' ? 'LIVE' : 'UPCOMING'}
                    </Text>
                </View>
            </View>

            <View style={styles.matchMain}>
                <TouchableOpacity style={styles.matchTeam} onPress={() => handleTeamPress(item.homeTeam)}>
                    <View style={styles.teamLogoBg}>
                        <UsersIcon size={24} color="#495057" />
                    </View>
                    <Text style={styles.matchTeamName} numberOfLines={1}>{item.homeTeam}</Text>
                </TouchableOpacity>

                <View style={styles.matchVs}>
                    <Text style={styles.vsText}>VS</Text>
                </View>

                <TouchableOpacity style={styles.matchTeam} onPress={() => handleTeamPress(item.awayTeam)}>
                    <View style={styles.teamLogoBg}>
                        <UsersIcon size={24} color="#495057" />
                    </View>
                    <Text style={styles.matchTeamName} numberOfLines={1}>{item.awayTeam}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.matchFooter}>
                <View style={styles.matchInfoLine}>
                    <MapPin size={12} color="#ADB5BD" />
                    <Text style={styles.matchInfoText}>{item.stadium}</Text>
                </View>

                {item.referees && (
                    <View style={styles.matchReferees}>
                        <ShieldCheck size={12} color="#00FF41" />
                        <Text style={styles.refereeLabel}>Referees:</Text>
                        <Text style={styles.refereeNames} numberOfLines={1}>
                            {item.referees.join(', ')}
                        </Text>
                    </View>
                )}

                {(item.homeFormation || item.awayFormation) && (
                    <TouchableOpacity
                        style={styles.formationButton}
                        onPress={() => {
                            setSelectedMatch(item);
                            setShowFormationModal(true);
                        }}
                    >
                        <Star size={14} color="#FFF" />
                        <Text style={styles.formationButtonText}>View Formations</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />

                {/* Toggle Bar */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>TAK <Text style={{ color: '#00FF41' }}>WIRA</Text></Text>
                    <View style={styles.tabBar}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'tournaments' && styles.activeTab]}
                            onPress={() => setActiveTab('tournaments')}
                        >
                            <Trophy size={16} color={activeTab === 'tournaments' ? '#000' : '#ADB5BD'} />
                            <Text style={[styles.tabText, activeTab === 'tournaments' && styles.activeTabText]}>Tournaments</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
                            onPress={() => setActiveTab('matches')}
                        >
                            <Calendar size={16} color={activeTab === 'matches' ? '#000' : '#ADB5BD'} />
                            <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>Matches</Text>
                            {todayMatches.length > 0 && (
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{todayMatches.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'tournaments' ? (
                    <FlatList
                        data={tournaments}
                        renderItem={renderTournament}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <FlatList
                        data={todayMatches}
                        renderItem={renderMatch}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyState}>
                                <Calendar size={48} color="#DEE2E6" />
                                <Text style={styles.emptyStateText}>No matches scheduled for today</Text>
                            </View>
                        }
                    />
                )}
            </SafeAreaView>

            {/* Formation Modal */}
            <Modal
                visible={showFormationModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFormationModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Match Formations</Text>
                            <TouchableOpacity onPress={() => setShowFormationModal(false)}>
                                <X size={24} color="#212529" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedMatch?.homeFormation && (
                                <FootballPitch
                                    teamName={selectedMatch.homeTeam}
                                    players={selectedMatch.homeFormation.players}
                                    color="#00FF41"
                                />
                            )}
                            <View style={styles.pitchDivider} />
                            {selectedMatch?.awayFormation && (
                                <FootballPitch
                                    teamName={selectedMatch.awayTeam}
                                    players={selectedMatch.awayFormation.players}
                                    color="#FF3B30"
                                />
                            )}
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Team Agenda Modal */}
            <Modal
                visible={selectedTeamAgenda !== null}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setSelectedTeamAgenda(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.agendaModal}>
                        <View style={styles.modalHeader}>
                            <View style={styles.agendaTitleRow}>
                                <UsersIcon size={24} color="#00FF41" />
                                <Text style={styles.modalTitle}>{selectedTeamAgenda?.name} Agenda</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedTeamAgenda(null)}>
                                <X size={24} color="#212529" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.agendaList}>
                            {selectedTeamAgenda?.agenda ? (
                                selectedTeamAgenda.agenda.map((item: any, idx: number) => (
                                    <View key={idx} style={styles.agendaItem}>
                                        <View style={styles.agendaDate}>
                                            <Text style={styles.agendaDay}>{item.date.split('-')[2]}</Text>
                                            <Text style={styles.agendaMonth}>{new Date(item.date).toLocaleString('default', { month: 'short' })}</Text>
                                        </View>
                                        <View style={styles.agendaDetails}>
                                            <Text style={styles.agendaOpponent}>vs {item.opponent}</Text>
                                            <Text style={styles.agendaTournament}>{item.tournament}</Text>
                                        </View>
                                        <ChevronRight size={16} color="#ADB5BD" />
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyAgenda}>
                                    <Clock size={48} color="#DEE2E6" />
                                    <Text style={styles.emptyStateText}>No future matches scheduled</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Tournament Agenda Modal */}
            <Modal
                visible={selectedTournament !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setSelectedTournament(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View style={styles.agendaTitleRow}>
                                <ListFilter size={24} color="#00FF41" />
                                <Text style={styles.modalTitle}>{selectedTournament?.name} Agenda</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSelectedTournament(null)}>
                                <X size={24} color="#212529" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {matches.filter(m => m.tournamentId === selectedTournament?.id).map((match) => (
                                <View key={match.id} style={styles.tournamentMatchItem}>
                                    <View style={styles.tournamentMatchHeader}>
                                        <Calendar size={12} color="#6C757D" />
                                        <Text style={styles.tournamentMatchDate}>{match.date} • {match.time}</Text>
                                    </View>
                                    <View style={styles.tournamentMatchMain}>
                                        <Text style={styles.tournamentMatchTeam}>{match.homeTeam}</Text>
                                        <Text style={styles.tournamentMatchVs}>VS</Text>
                                        <Text style={styles.tournamentMatchTeam}>{match.awayTeam}</Text>
                                    </View>
                                    {match.referees && (
                                        <View style={styles.tournamentMatchReferees}>
                                            <ShieldCheck size={12} color="#00FF41" />
                                            <Text style={styles.refereeNames}>Referees: {match.referees.join(', ')}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                            <View style={{ height: 40 }} />
                        </ScrollView>
                    </View>
                </View>
            </Modal>

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
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F3F5',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#000',
        marginBottom: 15,
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F1F3F5',
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
    },
    activeTab: {
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6C757D',
    },
    activeTabText: {
        color: '#000',
    },
    countBadge: {
        backgroundColor: '#FF3B30',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2,
    },
    countText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120,
    },
    cardContainer: {
        marginBottom: 25,
    },
    card: {
        height: 180,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    completedCard: {
        height: 150,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
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
        bottom: 15,
        left: 20,
    },
    tournamentName: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    detailText: {
        color: '#E9ECEF',
        fontSize: 13,
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
    completedBadge: {
        backgroundColor: 'rgba(108, 117, 125, 0.9)',
    },
    statusText: {
        color: '#000',
        fontSize: 11,
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
        fontSize: 10,
        fontWeight: '600',
    },
    tournamentAgendaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        gap: 8,
        marginTop: -10,
        zIndex: -1,
        paddingTop: 15,
    },
    tournamentAgendaButtonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
    },
    resultsContainer: {
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 15,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
    },
    tournamentMatchReferees: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 6,
    },
    resultsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    resultsTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#212529',
        marginLeft: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    resultsGrid: {
        gap: 15,
    },
    topPerformers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    performerCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    performerIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    performerLabel: {
        fontSize: 10,
        color: '#6C757D',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    performerName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#212529',
    },
    performerSubtext: {
        fontSize: 10,
        color: '#00FF41',
        fontWeight: '700',
    },
    rankingsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F1F3F5',
        paddingVertical: 12,
        borderRadius: 12,
    },
    rankItem: {
        alignItems: 'center',
        flex: 1,
    },
    rankBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#ADB5BD',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -10,
        zIndex: 2,
    },
    rank1: { backgroundColor: '#FFD700' },
    rank2: { backgroundColor: '#C0C0C0' },
    rank3: { backgroundColor: '#CD7F32' },
    rankText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '900',
    },
    rankLogo: {
        width: 40,
        height: 40,
        marginBottom: 5,
    },
    rankTeamName: {
        fontSize: 10,
        fontWeight: '700',
        color: '#495057',
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    matchCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F3F5',
    },
    matchTimeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    matchTimeText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#495057',
        marginLeft: 6,
        flex: 1,
    },
    matchStatusPill: {
        backgroundColor: '#F1F3F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    liveMatchPill: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    matchStatusText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#6C757D',
    },
    liveMatchText: {
        color: '#FF3B30',
    },
    matchMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    matchTeam: {
        flex: 1,
        alignItems: 'center',
    },
    teamLogoBg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    matchTeamName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#212529',
        textAlign: 'center',
    },
    matchVs: {
        width: 40,
        alignItems: 'center',
    },
    vsText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#DEE2E6',
    },
    matchFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F1F3F5',
        paddingTop: 15,
    },
    matchInfoLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    matchInfoText: {
        fontSize: 12,
        color: '#6C757D',
        fontWeight: '600',
        marginLeft: 6,
    },
    matchReferees: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: 'rgba(0, 255, 65, 0.05)',
        padding: 8,
        borderRadius: 8,
    },
    refereeLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#495057',
        marginLeft: 6,
        marginRight: 4,
    },
    refereeNames: {
        fontSize: 11,
        color: '#6C757D',
        fontWeight: '600',
        flex: 1,
    },
    formationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1A1A1A',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    formationButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '800',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyStateText: {
        marginTop: 15,
        fontSize: 16,
        color: '#ADB5BD',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '90%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#212529',
    },
    pitchDivider: {
        height: 2,
        backgroundColor: '#F1F3F5',
        marginVertical: 30,
        width: '60%',
        alignSelf: 'center',
    },
    agendaModal: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        margin: 20,
        maxHeight: '80%',
        padding: 25,
    },
    agendaTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    agendaList: {
        marginTop: 10,
    },
    agendaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    agendaDate: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        width: 50,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    agendaDay: {
        fontSize: 18,
        fontWeight: '900',
        color: '#212529',
    },
    agendaMonth: {
        fontSize: 10,
        fontWeight: '800',
        color: '#00FF41',
        textTransform: 'uppercase',
    },
    agendaDetails: {
        flex: 1,
        marginLeft: 15,
    },
    agendaOpponent: {
        fontSize: 16,
        fontWeight: '800',
        color: '#212529',
    },
    agendaTournament: {
        fontSize: 12,
        color: '#6C757D',
        fontWeight: '600',
        marginTop: 2,
    },
    emptyAgenda: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    tournamentMatchItem: {
        backgroundColor: '#F8F9FA',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    tournamentMatchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 6,
    },
    tournamentMatchDate: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6C757D',
    },
    tournamentMatchMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tournamentMatchTeam: {
        fontSize: 16,
        fontWeight: '800',
        color: '#212529',
        flex: 1,
    },
    tournamentMatchVs: {
        fontSize: 14,
        fontWeight: '900',
        color: '#DEE2E6',
        marginHorizontal: 15,
    },
});
