import { useRouter } from 'expo-router';
import { AlertCircle, ArrowRight, Pizza, Shield, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    // Simple mock validation
    if (email.trim() === '') {
      setError('Please enter your email to continue!');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address!');
      return;
    }

    login(email.trim(), selectedRole);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-center px-6">
      <View className="items-center mb-8">
        {/* Brand Logo */}
        <View
          style={{
            backgroundColor: colors.primaryLight,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 15,
          }}
          className="p-5 rounded-full mb-4"
        >
          <Pizza size={50} color={colors.primary} strokeWidth={2.5} />
        </View>
        <Text style={{ color: colors.text }} className="text-3xl font-black tracking-tight text-center">
          QUAN-ZA PIZZA
        </Text>
        <Text style={{ color: colors.textMuted }} className="text-sm text-center mt-1">
          Premium Handcrafted Italian Pizzas
        </Text>
      </View>

      {/* Inputs Card */}
      <View
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
        className="p-6 rounded-[32px] border mb-6 shadow-sm"
      >
        <Text style={{ color: colors.text }} className="text-lg font-black mb-4">
          Welcome Back
        </Text>

        {/* Error banner */}
        {error !== '' && (
          <View className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-2xl mb-4 flex-row items-center">
            <AlertCircle size={16} color="#ef4444" className="mr-2" />
            <Text className="text-rose-500 text-xs font-bold flex-1">{error}</Text>
          </View>
        )}

        {/* Email Input */}
        <View className="mb-5">
          <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
            Email Address
          </Text>
          <TextInput
            placeholder="name@domain.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ color: colors.text, backgroundColor: colors.background, borderColor: colors.border }}
            className="px-4 py-3.5 rounded-2xl border text-sm font-semibold"
          />
        </View>

        {/* Role Selection */}
        <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
          Select Role
        </Text>
        <View
          style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: isDark ? '#1e293b' : '#f1f5f9' }}
          className="flex-row mb-6 p-1.5 rounded-2xl border"
        >
          <TouchableOpacity
            onPress={() => setSelectedRole('user')}
            style={{
              backgroundColor: selectedRole === 'user' ? colors.primary : 'transparent',
            }}
            className="flex-1 py-3 rounded-xl items-center justify-center flex-row"
          >
            <User size={14} color={selectedRole === 'user' ? 'white' : colors.textMuted} className="mr-1.5" />
            <Text
              style={{
                color: selectedRole === 'user' ? 'white' : colors.text,
                fontWeight: selectedRole === 'user' ? 'bold' : '600',
              }}
              className="text-xs"
            >
              Customer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedRole('admin')}
            style={{
              backgroundColor: selectedRole === 'admin' ? colors.primary : 'transparent',
            }}
            className="flex-1 py-3 rounded-xl items-center justify-center flex-row"
          >
            <Shield size={14} color={selectedRole === 'admin' ? 'white' : colors.textMuted} className="mr-1.5" />
            <Text
              style={{
                color: selectedRole === 'admin' ? 'white' : colors.text,
                fontWeight: selectedRole === 'admin' ? 'bold' : '600',
              }}
              className="text-xs"
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign In CTA */}
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
          className="py-4 rounded-2xl flex-row items-center justify-center"
        >
          <Text className="text-white font-extrabold text-base mr-2">
            Enter Kitchen
          </Text>
          <ArrowRight size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Guest Login shortcut */}
      <TouchableOpacity
        onPress={() => {
          login('guest@pizza.app', 'user');
          router.replace('/(tabs)');
        }}
        className="py-3 items-center"
      >
        <Text style={{ color: colors.textMuted }} className="text-xs font-bold underline">
          Continue as Guest
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
