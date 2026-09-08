import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, 
  StatusBar, ActivityIndicator, Image 
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import ProfileScreen from './components/profil';

// Imports pour la navigation et la gestion des zones sécurisées
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostDetails from './ecran/PostDetails/PostDetails';
import HomeScreen from './ecran/tabs/index';
import NotificationsScreen from './ecran/Notifications';
import OfficialDetails from './ecran/Officiels/OfficialDetails';
import { API_BASE_URL } from './config/api';
import SweetedSplash from './components/SweetedSplash';
import { COLORS, SPACING, RADIUS, FONTS } from './config/theme';

const Stack = createStackNavigator();

const LoginScreen = () => {
  const navigation = useNavigation();
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricule_number: matricule.trim(), password })
      });

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
      setFeedback({ type: 'error', message: 'Impossible de joindre le serveur. Vérifiez votre connexion.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
    

      <View style={styles.contentContainer}>
        <View style={styles.topSection}>
          {/* Correction ici : Utilisation de blanc en dur pour plus de clarté */}
          <Image 
          source={require('./sweeted_logo-no_background.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleButton, isLoginView && styles.activeToggle]} 
              onPress={() => setIsLoginView(true)}
            >
              <Text style={isLoginView ? styles.activeToggleText : styles.inactiveToggleText}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !isLoginView && styles.activeToggle]} 
              onPress={() => setIsLoginView(false)}
            >
              <Text style={!isLoginView ? styles.activeToggleText : styles.inactiveToggleText}>Inscription</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Numéro matricule:</Text>
            <View style={styles.inputContainer}>
              <Icon name="account-outline" size={22} color={COLORS.textSecondary} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="Ex: 37-40014/24"
                value={matricule}
                onChangeText={setMatricule}
              />
            </View>

            <Text style={styles.inputLabel}>Mot de passe:</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={22} color={COLORS.textSecondary} />
              <TextInput
                style={styles.textInputStyle}
                placeholder="•••••"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bouton de navigation vers l'écran principal */}
          {feedback.message ? (
            <Text style={feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess}>
              {feedback.message}
            </Text>
          ) : null}

          <TouchableOpacity 
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]} 
            onPress={handleAuth}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
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

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
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
      <View style={styles.loadingContainer}>
        <Image 
          source={require('./sweeted_logo-no_background.png')} 
          style={styles.loadingLogo} 
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 20 }} />
      </View>
    );
  }

return (
    <SafeAreaProvider style={{ flex: 1, height: '100%', width: '100%' }}> 
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 2, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.headerGreen },
  loadingLogo: { width: 140, height: 140 },
  contentContainer: {flex: 1, overflow: 'hidden', borderRadius: 28, marginBottom: 20},
  topSection: { backgroundColor: COLORS.headerGreen, padding: 30, alignItems: 'center' },
  bottomSection: { flex: 1, backgroundColor: COLORS.formBackground, padding: 20 },
  toggleContainer: { flexDirection: 'row', backgroundColor: COLORS.toggleBackground, borderRadius: 25, height: 50, marginBottom: 20 },
  toggleButton: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 25 },
  activeToggle: { backgroundColor: '#20ac4c' },
  activeToggleText: { color: 'white', fontWeight: 'bold' },
  inactiveToggleText: { color: COLORS.white },
  form: { flex: 1 },
  inputLabel: { fontWeight: 'bold', marginBottom: 5, color: COLORS.text },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.textInput, borderRadius: RADIUS.md, paddingHorizontal: 10, height: 50, marginBottom: 15 },
  textInputStyle: { flex: 1, marginLeft: 10 },
  loginButton: { backgroundColor: COLORS.primary, height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  feedbackError: { color: '#D64545', marginBottom: 10, textAlign: 'center' },
  feedbackSuccess: { color: COLORS.primary, marginBottom: 10, textAlign: 'center' }
});