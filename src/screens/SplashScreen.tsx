import { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressWidth, {
        toValue: 200,
        duration: 2500,
        useNativeDriver: false,
      }),
    ]).start();

    // Navigate to Home after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Home');
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, slideAnim, progressWidth]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[styles.logoContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>TW</Text>
          </View>
          <View style={styles.glowEffect} />
        </Animated.View>

        <Animated.Text
          style={[styles.title, { transform: [{ translateY: slideAnim }] }]}
        >
          TAK<Text style={styles.highlight}>WIRA</Text>
        </Animated.Text>

        <Text style={styles.subtitle}>Live your passion for football</Text>

        <View style={styles.loadingContainer}>
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                { width: progressWidth },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Animated.View>

      {/* Background decorations */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A2917',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#00FF41',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  glowEffect: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0, 255, 65, 0.3)',
    top: -15,
    left: -15,
    zIndex: 1,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    marginBottom: 10,
  },
  highlight: {
    color: '#00FF41',
  },
  subtitle: {
    fontSize: 16,
    color: '#A0A0A0',
    fontStyle: 'italic',
    marginBottom: 60,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#00FF41',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
    letterSpacing: 1,
  },
  decorCircle1: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    top: -width * 0.2,
    right: -width * 0.2,
  },
  decorCircle2: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
});

