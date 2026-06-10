import { Tabs } from 'expo-router';
import React from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { Pizza, ReceiptText, User, ShoppingBag } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { role } = useAuth();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Pizza size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: role === 'admin' ? 'Kitchen Orders' : 'My Orders',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <ReceiptText size={size} color={color} />,
        }}
      />
      {/* We always keep the screen available in routing, but conditionally style/display it */}
      <Tabs.Screen
        name="admin-products"
        options={{
          title: 'Inventory',
          headerShown: false,
          href: role === 'admin' ? '/admin-products' : null, // hide tab completely if not admin
          tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
