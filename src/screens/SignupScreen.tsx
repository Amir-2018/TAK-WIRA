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
    ScrollView,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function SignupScreen({ navigation }: any) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'player' | 'coach'>('player');
    const { login } = useApp();

    const handleSignup = () => {
        // Basic validation
        if (fullName && email && password && password === confirmPassword) {
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
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                        </View>

                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>TAK<Text style={styles.logoHighlight}>WIRA</Text></Text>
                            <Text style={styles.tagline}>Create your account</Text>
                        </View>

                        <View style={styles.glassCard}>
                            <Text style={styles.title}>Join the Game</Text>

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
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#A0A0A0"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
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
                                <Text style={styles.label}>Age</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your age"
                                    placeholderTextColor="#A0A0A0"
                                    value={age}
                                    onChangeText={setAge}
                                    keyboardType="numeric"
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

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#A0A0A0"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.signupBtn}
                                onPress={handleSignup}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.signupBtnText}>CREATE ACCOUNT</Text>
                            </TouchableOpacity>

                            <View style={styles.loginLinkContainer}>
                                <Text style={styles.alreadyHaveAccountText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.loginLinkText}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
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
        backgroundColor: 'rgba(0, 50, 0, 0.4)',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
        paddingVertical: 40,
    },
    topHeader: {
        position: 'absolute',
        top: 0,
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
        marginBottom: 30,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    logoHighlight: {
        color: '#00FF41',
    },
    tagline: {
        color: '#E0E0E0',
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 5,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontSize: 24,
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
        paddingVertical: 8,
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
        paddingVertical: 12,
        paddingHorizontal: 16,
        color: '#FFFFFF',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    signupBtn: {
        backgroundColor: '#00FF41',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    signupBtnText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    alreadyHaveAccountText: {
        color: '#E0E0E0',
        fontSize: 14,
    },
    loginLinkText: {
        color: '#00FF41',
        fontSize: 14,
        fontWeight: '700',
    },
});
