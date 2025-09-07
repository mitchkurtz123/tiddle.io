// app/login.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { auth, login, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'surface');
  const inputBackground = useThemeColor({}, 'surfaceSecondary');
  const borderColor = useThemeColor({}, 'border');
  const focusColor = useThemeColor({}, 'borderFocus');
  const placeholderColor = useThemeColor({}, 'textSecondary');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    clearError();
    await login(email.trim(), password);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Background Gradient Effect */}
      <ThemedView style={[styles.backgroundGradient, { backgroundColor: tintColor }]} />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Login Card */}
          <ThemedView style={[styles.loginCard, { backgroundColor: cardBackground }]}>
            {/* Header Section */}
            <ThemedView style={styles.headerSection}>
              <ThemedView style={styles.logoContainer}>
                <Image
                  source={require('@/assets/images/black-logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </ThemedView>
              <ThemedText type="title" style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to continue to Tiddle.io
              </ThemedText>
            </ThemedView>

            {/* Login Form */}
            <ThemedView style={styles.formSection}>
              {/* Email Input */}
              <ThemedView style={styles.inputGroup}>
                <ThemedView style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: inputBackground,
                    borderColor: emailFocused ? focusColor : borderColor,
                  }
                ]}>
                  <IconSymbol size={20} name="envelope.fill" color={borderColor} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Email address"
                    placeholderTextColor={placeholderColor}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!auth.isLoading}
                  />
                </ThemedView>
              </ThemedView>

              {/* Password Input */}
              <ThemedView style={styles.inputGroup}>
                <ThemedView style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: inputBackground,
                    borderColor: passwordFocused ? focusColor : borderColor,
                  }
                ]}>
                  <IconSymbol size={20} name="lock.fill" color={borderColor} />
                  <TextInput
                    style={[styles.input, { color: textColor }]}
                    placeholder="Password"
                    placeholderTextColor={placeholderColor}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    secureTextEntry
                    editable={!auth.isLoading}
                  />
                </ThemedView>
              </ThemedView>

              {/* Error Message */}
              {auth.error && (
                <ThemedView style={styles.errorContainer}>
                  <IconSymbol size={16} name="exclamationmark.triangle.fill" color="#ff3b30" />
                  <ThemedText style={styles.errorText}>{auth.error}</ThemedText>
                </ThemedView>
              )}

              {/* Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  { backgroundColor: tintColor },
                  auth.isLoading && styles.loginButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={auth.isLoading}
                activeOpacity={0.8}
              >
                {auth.isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <IconSymbol size={18} name="arrow.right" color="white" />
                )}
                <ThemedText style={styles.loginButtonText}>
                  {auth.isLoading ? 'Signing In...' : 'Sign In'}
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>

            {/* Footer */}
            <ThemedView style={styles.footer}>
              <ThemedText style={styles.footerText}>
                Secure authentication powered by Bubble.io
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    opacity: 0.1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  loginCard: {
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    flex: 1,
  },
  loginButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  footerText: {
    fontSize: 13,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 18,
  },
});