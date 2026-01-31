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

export default function ForgotPasswordScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleReset = () => {
        if (email) {
            setSubmitted(true);
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
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>TAK<Text style={styles.logoHighlight}>WIRA</Text></Text>
                    </View>

                    <View style={styles.glassCard}>
                        <Text style={styles.title}>Reset Password</Text>

                        {!submitted ? (
                            <>
                                <Text style={styles.description}>
                                    Enter your email address and we'll send you instructions to reset your password.
                                </Text>

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

                                <TouchableOpacity
                                    style={styles.resetBtn}
                                    onPress={handleReset}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.resetBtnText}>SEND INSTRUCTIONS</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View style={styles.successContainer}>
                                <Text style={styles.successText}>
                                    Check your email! we've sent instructions to {email}.
                                </Text>
                                <TouchableOpacity
                                    style={styles.resetBtn}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    <Text style={styles.resetBtnText}>BACK TO LOGIN</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backText}>Back to Sign In</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(0, 50, 0, 0.4)',
    },
    keyboardView: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 25,
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
        color: '#00FF41',
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#E0E0E0',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    inputContainer: {
        marginBottom: 24,
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
    resetBtn: {
        backgroundColor: '#00FF41',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    resetBtnText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    successContainer: {
        alignItems: 'center',
    },
    successText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    backBtn: {
        marginTop: 24,
        alignItems: 'center',
    },
    backText: {
        color: '#00FF41',
        fontSize: 14,
        fontWeight: '600',
    },
});
