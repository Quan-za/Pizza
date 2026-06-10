import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Switch, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useOrders } from '../../providers/OrderProvider';
import { User, MapPin, Moon, ShieldCheck, Check, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, role, setRole, updateProfile, logout, login } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const { orders } = useOrders();

  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaved, setIsSaved] = useState(false);

  // Statistics
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'New' || o.status === 'Cooking' || o.status === 'Delivering'
  ).length;

  const handleSaveProfile = () => {
    updateProfile({ name, address });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRoleToggle = (value: boolean) => {
    setRole(value ? 'admin' : 'user');
  };

  const handleLoginMock = () => {
    login('amos@pizza.app', 'user');
    if (user) {
      setName(user.name);
      setAddress(user.address);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }} style={{ paddingTop: Platform.OS === 'android' ? 35 : 0 }}>
        
        {/* Title */}
        <View className="mb-6">
          <Text style={{ color: colors.text }} className="text-3xl font-black tracking-tight">
            My Profile
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm">
            Manage address, toggle roles, and customize settings.
          </Text>
        </View>

        {user ? (
          <>
            {/* User Info Header Card */}
            <View
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-6 rounded-3xl border mb-6 items-center"
            >
              <Image
                source={{ uri: user.avatar }}
                className="w-24 h-24 rounded-full mb-3 border-4 border-orange-500/10"
              />
              <Text style={{ color: colors.text }} className="text-xl font-black">
                {user.name}
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-sm mb-4">
                {user.email}
              </Text>

              {/* Stats badges */}
              <View className="flex-row w-full justify-around border-t pt-4" style={{ borderColor: colors.border }}>
                <View className="items-center">
                  <Text style={{ color: colors.primary }} className="text-lg font-black">
                    {totalOrders}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-wider">
                    Total Orders
                  </Text>
                </View>
                <View className="items-center">
                  <Text style={{ color: colors.primary }} className="text-lg font-black">
                    {activeOrdersCount}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-wider">
                    Active Orders
                  </Text>
                </View>
                <View className="items-center">
                  <Text style={{ color: colors.primary }} className="text-lg font-black">
                    {role.toUpperCase()}
                  </Text>
                  <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-wider">
                    Active Role
                  </Text>
                </View>
              </View>
            </View>

            {/* Editable Profile Settings */}
            <View
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-5 rounded-3xl border mb-6"
            >
              <Text style={{ color: colors.text }} className="text-base font-black mb-4">
                Profile Details
              </Text>

              {/* Name input */}
              <View className="mb-4">
                <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
                  Full Name
                </Text>
                <View
                  style={{ backgroundColor: colors.background, borderColor: colors.border }}
                  className="flex-row items-center px-4 py-3 rounded-2xl border"
                >
                  <User size={16} color={colors.textMuted} className="mr-2" />
                  <TextInput
                    placeholder="Enter name"
                    placeholderTextColor={colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    style={{ color: colors.text }}
                    className="flex-1 text-sm font-semibold py-0"
                  />
                </View>
              </View>

              {/* Address input */}
              <View className="mb-4">
                <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
                  Delivery Address
                </Text>
                <View
                  style={{ backgroundColor: colors.background, borderColor: colors.border }}
                  className="flex-row items-center px-4 py-3 rounded-2xl border"
                >
                  <MapPin size={16} color={colors.textMuted} className="mr-2" />
                  <TextInput
                    placeholder="Enter delivery address"
                    placeholderTextColor={colors.textMuted}
                    value={address}
                    onChangeText={setAddress}
                    multiline
                    style={{ color: colors.text }}
                    className="flex-1 text-sm font-semibold py-0"
                  />
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={{ backgroundColor: isSaved ? colors.success : colors.primary }}
                className="py-3.5 rounded-2xl items-center justify-center flex-row"
              >
                {isSaved ? (
                  <>
                    <Check size={16} color="white" className="mr-2" />
                    <Text className="text-white font-extrabold text-xs">Profile Saved</Text>
                  </>
                ) : (
                  <Text className="text-white font-extrabold text-xs">Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* General Preferences & Toggles */}
            <View
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-5 rounded-3xl border mb-6"
            >
              <Text style={{ color: colors.text }} className="text-base font-black mb-4">
                Preferences
              </Text>

              {/* Dark Mode Switch */}
              <View className="flex-row justify-between items-center py-2.5 border-b" style={{ borderColor: colors.border }}>
                <View className="flex-row items-center">
                  <Moon size={18} color={colors.textMuted} className="mr-3" />
                  <Text style={{ color: colors.text }} className="text-sm font-bold">
                    Dark Theme
                  </Text>
                </View>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#cbd5e1', true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              {/* Admin Switch */}
              <View className="flex-row justify-between items-center py-2.5">
                <View className="flex-row items-center">
                  <ShieldCheck size={18} color={colors.textMuted} className="mr-3" />
                  <View>
                    <Text style={{ color: colors.text }} className="text-sm font-bold">
                      Admin Mode
                    </Text>
                    <Text style={{ color: colors.textMuted }} className="text-[10px]">
                      Access inventory and update orders
                    </Text>
                  </View>
                </View>
                <Switch
                  value={role === 'admin'}
                  onValueChange={handleRoleToggle}
                  trackColor={{ false: '#cbd5e1', true: colors.primary }}
                  thumbColor={Platform.OS === 'ios' ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              onPress={logout}
              style={{ borderColor: '#ef4444' }}
              className="py-4 border-2 border-dashed rounded-3xl items-center justify-center flex-row mb-8"
            >
              <LogOut size={18} color="#ef4444" className="mr-2" />
              <Text className="text-rose-500 font-extrabold text-base">Sign Out</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-8 rounded-3xl border items-center mb-8"
          >
            <User size={48} color={colors.textMuted} className="mb-4" />
            <Text style={{ color: colors.text }} className="text-lg font-bold text-center mb-2">
              Logged Out
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-xs text-center mb-6 px-4">
              Log back in with our mock customer credentials to test the ordering pipeline.
            </Text>
            <TouchableOpacity
              onPress={handleLoginMock}
              style={{ backgroundColor: colors.primary }}
              className="px-8 py-3 rounded-full"
            >
              <Text className="text-white font-extrabold text-xs">Sign In (Mock)</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
