import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'player' | 'coach'>('player');
    const { login } = useApp();

    const handleLogin = () => {
        // Basic validation
        if (email && password) {
            login(email, role);
            // Navigate based on role
            if (role === 'coach') {
                navigation.replace('CoachDashboard');
            } else {
                navigation.replace('Home');
            }
        }
    };

    return (
        <ImageBackground
            source={require('../assets/stadium_bg.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.overlay} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.formContainer}>
                    <View style={styles.topHeader}>
                        <View style={styles.languageSwitcher}>
                            <TouchableOpacity style={styles.flagBtn}>
                                <Text style={styles.flagEmoji}>🇬🇧</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.flagBtn}>
                                <Text style={styles.flagEmoji}>🇫🇷</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileIndicator}>
                            <View style={styles.profileCircle}>
                                <Text style={styles.profileInitials}>{role === 'player' ? 'P' : 'C'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>TAK<Text style={styles.logoHighlight}>WIRA</Text></Text>
                        <Text style={styles.tagline}>Live your passion for football</Text>
                    </View>

                    <View style={styles.glassCard}>
                        <Text style={styles.title}>Welcome Back</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>I am a</Text>
                            <View style={styles.roleSelector}>
                                <TouchableOpacity
                                    style={[styles.roleOption, role === 'player' && styles.roleOptionActive]}
                                    onPress={() => setRole('player')}
                                >
                                    <Text style={[styles.roleText, role === 'player' && styles.roleTextActive]}>Player</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleOption, role === 'coach' && styles.roleOptionActive]}
                                    onPress={() => setRole('coach')}
                                >
                                    <Text style={[styles.roleText, role === 'coach' && styles.roleTextActive]}>Coach</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#A0A0A0"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#A0A0A0"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.forgotBtn}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginBtnText}>SIGN IN</Text>
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                            <Text style={styles.noAccountText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                <Text style={styles.signupText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 50, 0, 0.4)', // Subtle green tinted overlay
    },
    keyboardView: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingTop: 40,
    },
    topHeader: {
        position: 'absolute',
        top: 40,
        right: 0,
        zIndex: 10,
    },
    languageSwitcher: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 15,
        alignSelf: 'flex-end',
    },
    profileIndicator: {
        alignItems: 'center',
        marginVertical: 10,
    },
    profileCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        borderColor: '#00FF41',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00FF41',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    profileInitials: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    flagBtn: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    flagEmoji: {
        fontSize: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoText: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    logoHighlight: {
        color: '#00FF41', // Matrix/Sport green
    },
    tagline: {
        color: '#E0E0E0',
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 5,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    roleSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 4,
    },
    roleOption: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    roleOptionActive: {
        backgroundColor: '#00FF41',
    },
    roleText: {
        color: '#E0E0E0',
        fontSize: 14,
        fontWeight: '600',
    },
    roleTextActive: {
        color: '#000000',
    },
    label: {
        color: '#E0E0E0',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: '#00FF41',
        fontSize: 14,
        fontWeight: '500',
    },
    loginBtn: {
        backgroundColor: '#00FF41',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#00FF41',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 5,
    },
    loginBtnText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    noAccountText: {
        color: '#E0E0E0',
        fontSize: 14,
    },
    signupText: {
        color: '#00FF41',
        fontSize: 14,
        fontWeight: '700',
    },
});
