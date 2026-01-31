import React from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';

interface Player {
    id: string;
    name: string;
    position: { x: number; y: number };
    role: string;
}

interface FootballPitchProps {
    players: Player[];
    teamName: string;
    color?: string;
}

const { width } = Dimensions.get('window');
const PITCH_WIDTH = width * 0.9;
const PITCH_HEIGHT = PITCH_WIDTH * 1.4;

export default function FootballPitch({ players, teamName, color = '#00FF41' }: FootballPitchProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.teamTitle}>{teamName}</Text>

            <View style={styles.pitch}>
                {/* Pitch Lines */}
                <View style={styles.outline} />
                <View style={styles.centerLine} />
                <View style={styles.centerCircle} />
                <View style={styles.penaltyAreaTop} />
                <View style={styles.penaltyAreaBottom} />

                {/* Players */}
                {players.map((player) => (
                    <View
                        key={player.id}
                        style={[
                            styles.playerMarker,
                            {
                                left: `${player.position.x}%`,
                                top: `${player.position.y}%`,
                                backgroundColor: color
                            }
                        ]}
                    >
                        <View style={styles.playerShadow} />
                        <Text style={styles.playerName} numberOfLines={1}>{player.name}</Text>
                        <View style={styles.playerRoleBadge}>
                            <Text style={styles.playerRoleText}>{player.role}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    teamTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#212529',
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    pitch: {
        width: PITCH_WIDTH,
        height: PITCH_HEIGHT,
        backgroundColor: '#2E7D32',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        overflow: 'hidden',
        position: 'relative',
    },
    outline: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        margin: 10,
    },
    centerLine: {
        position: 'absolute',
        top: '50%',
        left: 10,
        right: 10,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    centerCircle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        marginLeft: -40,
        marginTop: -40,
    },
    penaltyAreaTop: {
        position: 'absolute',
        top: 10,
        left: '25%',
        width: '50%',
        height: 60,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderTopWidth: 0,
    },
    penaltyAreaBottom: {
        position: 'absolute',
        bottom: 10,
        left: '25%',
        width: '50%',
        height: 60,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderBottomWidth: 0,
    },
    playerMarker: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFF',
        marginLeft: -6,
        marginTop: -6,
        alignItems: 'center',
    },
    playerShadow: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        top: 2,
        left: -4,
        zIndex: -1,
    },
    playerName: {
        position: 'absolute',
        top: 15,
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        width: 60,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 5,
    },
    playerRoleBadge: {
        position: 'absolute',
        bottom: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },
    playerRoleText: {
        color: '#FFF',
        fontSize: 8,
        fontWeight: '800',
    },
});
