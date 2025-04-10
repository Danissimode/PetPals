import React, { useState } from 'react';
 import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
 import { useAuth } from '@/providers/AuthProvider';
 import { router } from 'expo-router';

 export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const handleSubmit = async () => {
  if (!email || !password || !confirmPassword) {
  setError('Please fill in all fields.');
  return;
  }

  if (password !== confirmPassword) {
  setError('Passwords do not match.');
  return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
  setError('Please enter a valid email address.');
  return;
  }

  try {
  setLoading(true);
  setError(null);
  await signUp(email, password);
  router.replace('/(tabs)');
  } catch (e: any) {
  setError(e.message || 'Sign-up failed');
  } finally {
  setLoading(false);
  }
  };

  return (
  <View style={styles.container}>
  <View style={styles.loginContainer}>
  <View style={styles.logoContainer}>
  <Text style={styles.logoText}>Pet Pals</Text>
  </View>
  <Text style={styles.subtitle}>Sign up to join our community</Text>

  {error && <Text style={styles.errorText}>{error}</Text>}

  <View style={styles.inputGroup}>
  <TextInput
  style={styles.input}
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
  />
  </View>

  <View style={styles.inputGroup}>
  <TextInput
  style={styles.input}
  placeholder="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  />
  </View>

  <View style={styles.inputGroup}>
  <TextInput
  style={styles.input}
  placeholder="Confirm Password"
  value={confirmPassword}
  onChangeText={setConfirmPassword}
  secureTextEntry
  />
  </View>

  <TouchableOpacity
  style={[styles.button, loading && styles.buttonDisabled]}
  onPress={handleSubmit}
  disabled={loading}>
  {loading ? (
  <ActivityIndicator color="#FFFFFF" />
  ) : (
  <Text style={styles.buttonText}>Sign Up</Text>
  )}
  </TouchableOpacity>

  <View style={styles.signUpContainer}>
  <Text style={styles.signUpText}>Already have an account? </Text>
  <TouchableOpacity onPress={() => router.push('/login')}>
  <Text style={styles.signUpLink}>Log in</Text>
  </TouchableOpacity>
  </View>
  </View>
  </View>
  );
 }

 const styles = StyleSheet.create({
  container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  padding: 20,
  },
  loginContainer: {
  width: '100%',
  maxWidth: 400,
  padding: 30,
  borderRadius: 15,
  borderColor: '#DBDBDB',
  borderWidth: 1,
  },
  logoContainer: {
  alignItems: 'center',
  marginBottom: 20,
  },
  logoText: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#FF9F1C',
  },
  subtitle: {
  fontSize: 16,
  color: '#8E8E93',
  marginBottom: 30,
  textAlign: 'center',
  },
  inputGroup: {
  marginBottom: 15,
  },
  input: {
  backgroundColor: '#FAFAFA',
  borderWidth: 1,
  borderColor: '#DBDBDB',
  borderRadius: 5,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 16,
  color: '#262626',
  },
  button: {
  backgroundColor: '#0095F6',
  borderRadius: 5,
  paddingVertical: 14,
  alignItems: 'center',
  },
  buttonDisabled: {
  backgroundColor: '#B2DFFC',
  },
  buttonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
  },
  signUpContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 15,
  },
  signUpText: {
  color: '#333333',
  fontSize: 14,
  },
  signUpLink: {
  color: '#0095F6',
  fontSize: 14,
  fontWeight: 'bold',
  },
  errorText: {
  color: '#FF3B30',
  fontSize: 14,
  textAlign: 'center',
  marginBottom: 10,
  },
 });
