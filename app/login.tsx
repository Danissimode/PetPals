import React, { useState } from 'react';
    import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
    import { useAuth } from '@/providers/AuthProvider';
    import { router } from 'expo-router';
    import { FontAwesome, FontAwesome5, Entypo } from '@expo/vector-icons';

    export default function LoginScreen() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const { signIn } = useAuth();

      const handleSubmit = async () => {
        if (!email || !password) {
          setError('Please enter both email and password.');
          return;
        }

        try {
          setLoading(true);
          setError(null);
          await signIn(email, password);
        } catch (e: any) {
          setError(e.message || 'Invalid credentials');
        } finally {
          setLoading(false);
        }
      };

      const handleSSO = async (provider: string) => {
        // TODO: Implement SSO with Meta, Google, LinkedIn
        console.log(`Signing in with ${provider}`);
      };

      return (
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Pet Pals</Text>
            </View>
            <Text style={styles.subtitle}>Sign in to continue</Text>

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

            <TouchableOpacity style={styles.forgotPasswordLink}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.ssoButtonsContainer}>
              <TouchableOpacity style={styles.ssoButton} onPress={() => handleSSO('meta')}>
                <FontAwesome name="facebook-square" size={24} color="#385185" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ssoButton} onPress={() => handleSSO('google')}>
                <FontAwesome5 name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ssoButton} onPress={() => handleSSO('linkedin')}>
                <Entypo name="linkedin" size={24} color="#0077B5" />
              </TouchableOpacity>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signUpLink}>Sign up</Text>
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
      logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
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
      forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginBottom: 24,
      },
      forgotPasswordText: {
        color: '#333333',
        fontSize: 14,
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
      separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
      },
      separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#DBDBDB',
      },
      separatorText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: '#8E8E93',
      },
      ssoButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
      },
      ssoButton: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: '#FAFAFA',
      },
      facebookButton: {
        backgroundColor: '#385185',
        borderRadius: 5,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 20,
      },
      facebookButtonText: {
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
