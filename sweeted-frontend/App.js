import React, { useEffect, useState, useMemo } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  StatusBar, ActivityIndicator, Image, Platform, useWindowDimensions
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import ProfileScreen from './components/profil';

// Imports pour la navigation et la gestion des zones sécurisées
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostDetails from './ecran/PostDetails/PostDetails';
import HomeScreen from './ecran/tabs/index';
import NotificationsScreen from './ecran/Notifications';
import OfficialDetails from './ecran/Officiels/OfficialDetails';
import { API_BASE_URL } from './config/api';
import SweetedSplash from './components/SweetedSplash';
import { SPACING, RADIUS, FONTS, SHADOWS } from './config/theme';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const Stack = createStackNavigator();

const LoginScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [isLoginView, setIsLoginView] = useState(true);
  const [password, setPassword] = useState('');
  const [matricule, setMatricule] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleAuth = async () => {
    if (!matricule.trim() || !password.trim()) {
      setFeedback({ type: 'error', message: 'Veuillez renseigner le matricule et le mot de passe.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const endpoint = isLoginView ? '/auth/login' : '/auth/register';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      let response;
      try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matricule_number: matricule.trim(), password }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = data.errors
          ? data.errors.map((error) => error.msg).join('\n')
          : data.message || 'Une erreur est survenue.';
        setFeedback({ type: 'error', message });
        return;
      }

      if (isLoginView) {
        if (data.token) {
          await AsyncStorage.setItem('token', data.token);
          if (data.role) {
            await AsyncStorage.setItem('userRole', String(data.role));
          }
        }

        setFeedback({ type: 'success', message: data.message || 'Connexion réussie.' });
        navigation.navigate('Home');
      } else {
        setFeedback({ type: 'success', message: data.message || 'Inscription réussie.' });
        setIsLoginView(true);
        setPassword('');
        setMatricule('');
      }
    } catch (error) {
      setFeedback({ type: 'error', message: error && error.name === 'AbortError' ? 'Le serveur ne repond pas (30s). Verifiez qu il est demarre et que vous etes sur le meme WiFi.' : 'Impossible de joindre le serveur. Verifiez votre connexion.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDesktop && styles.containerDesktop, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>
        <View style={[styles.topSection, { backgroundColor: colors.headerGreen }]}>
          <Image 
            source={require('./sweeted_logo-no_background.png')} 
            style={styles.loadingLogo} 
            resizeMode="contain"
          />
        </View>

        <View style={[styles.bottomSection, { backgroundColor: colors.formBackground }]}>
          <View style={[styles.toggleContainer, { backgroundColor: colors.toggleBackground }]}>
            <TouchableOpacity 
              style={[styles.toggleButton, isLoginView && [styles.activeToggle, { backgroundColor: colors.primaryDark }]]} 
              onPress={() => setIsLoginView(true)}
            >
              <Text style={isLoginView ? styles.activeToggleText : styles.inactiveToggleText}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !isLoginView && [styles.activeToggle, { backgroundColor: colors.primaryDark }]]} 
              onPress={() => setIsLoginView(false)}
            >
              <Text style={!isLoginView ? styles.activeToggleText : styles.inactiveToggleText}>Inscription</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Numéro matricule:</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
              <Icon name="account-outline" size={22} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInputStyle, { color: colors.text }]}
                placeholder="Ex: 37-40014/24"
                placeholderTextColor={colors.placeholder}
                value={matricule}
                onChangeText={setMatricule}
              />
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Mot de passe:</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
              <Icon name="lock-outline" size={22} color={colors.textSecondary} />
              <TextInput
                style={[styles.textInputStyle, { color: colors.text }]}
                placeholder="••••••••••"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Feedback messages */}
          {feedback.message ? (
            <Text style={feedback.type === 'error' ? styles.feedbackError : [styles.feedbackSuccess, { color: colors.primary }]}>
              {feedback.message}
            </Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: colors.primary }, isSubmitting && styles.loginButtonDisabled]} 
            onPress={handleAuth}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Text style={styles.loginButtonText}>
                {isLoginView ? 'Se connecter' : "S'inscrire"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

function AppRoot() {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const meController = new AbortController();
          const meTimeout = setTimeout(() => meController.abort(), 15000);
          let meResponse;
          try {
            meResponse = await fetch(`${API_BASE_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
              signal: meController.signal,
            });
          } finally {
            clearTimeout(meTimeout);
          }
          const response = meResponse;
          if (response.ok) {
            setInitialRoute('Home');
          } else {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userRole');
          }
        }
      } catch {
        // Erreur réseau — on reste sur Login
      }
      setIsAppLoading(false);
    };
    checkAuth();
  }, []);

  if (!splashDone) {
    return <SweetedSplash onDone={() => setSplashDone(true)} />;
  }

  if (isAppLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.headerGreen }]}>
        <Image 
          source={require('./sweeted_logo-no_background.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color={colors.onPrimary} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1, height: '100%', width: '100%', backgroundColor: colors.background }}> 
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PostDetails" component={PostDetails} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="OfficialDetails" component={OfficialDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRoot />
    </ThemeProvider>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.headerGreen },
  loadingLogo: { width: 140, height: 140 },
  contentContainer: {flex: 1, overflow: 'hidden', borderRadius: 28, marginBottom: 20},
  containerDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contentContainerDesktop: {
    flex: 1,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    maxHeight: 860,
    marginTop: 24,
    marginBottom: 24,
    ...SHADOWS.large,
  },
  topSection: { backgroundColor: colors.headerGreen, padding: 30, alignItems: 'center' },
  bottomSection: { flex: 1, backgroundColor: colors.formBackground, padding: 20 },
  toggleContainer: { flexDirection: 'row', backgroundColor: colors.toggleBackground, borderRadius: 25, height: 50, marginBottom: 20 },
  toggleButton: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 25 },
  activeToggle: { backgroundColor: colors.primaryDark },
  activeToggleText: { color: colors.onPrimary, fontWeight: 'bold' },
  inactiveToggleText: { color: colors.onPrimary },
  form: { flex: 1 },
  inputLabel: { fontWeight: 'bold', marginBottom: 5, color: colors.text },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground, borderRadius: RADIUS.md, paddingHorizontal: 10, height: 50, marginBottom: 15 },
  textInputStyle: { flex: 1, marginLeft: 10 },
  loginButton: { backgroundColor: colors.primary, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: colors.onPrimary, fontSize: 18, fontWeight: 'bold' },
  feedbackError: { color: colors.danger, marginBottom: 10, textAlign: 'center' },
  feedbackSuccess: { color: colors.primary, marginBottom: 10, textAlign: 'center' }
});