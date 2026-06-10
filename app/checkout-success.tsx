import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../providers/ThemeProvider';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react-native';

export default function CheckoutSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-center px-6">
      <View className="items-center py-6">
        {/* Animated Check circle indicator */}
        <View
          style={{
            backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
          }}
          className="p-6 rounded-full mb-6"
        >
          <CheckCircle2 size={80} color="#22c55e" strokeWidth={1.5} />
        </View>

        <Text style={{ color: colors.text }} className="text-3xl font-black text-center mb-2 tracking-tight">
          Order Confirmed!
        </Text>
        <Text style={{ color: colors.textMuted }} className="text-sm text-center mb-8 px-4">
          Thank you for your order! Your pizza is being handcrafted and will be delivered shortly.
        </Text>

        {/* Receipt Box */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="w-full p-6 rounded-3xl border mb-10"
        >
          <View className="flex-row justify-between mb-3 border-b border-dashed pb-3" style={{ borderColor: colors.border }}>
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold">ORDER ID</Text>
            <Text style={{ color: colors.text }} className="text-xs font-black">#{orderId}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">Status</Text>
            <Text style={{ color: colors.primary }} className="text-xs font-black">Preparing / New</Text>
          </View>
          
          <View className="flex-row justify-between">
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">Est. Delivery Time</Text>
            <Text style={{ color: colors.text }} className="text-xs font-black">25 - 35 mins</Text>
          </View>
        </View>

        {/* Action CTAs */}
        <View className="w-full">
          <TouchableOpacity
            onPress={() => router.replace(`/orders/${orderId}`)}
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
            className="py-4 rounded-3xl flex-row items-center justify-center mb-4"
          >
            <Text className="text-white font-extrabold text-base mr-2">Track Your Order</Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="py-4 rounded-3xl flex-row items-center justify-center border"
          >
            <ShoppingBag size={18} color={colors.text} className="mr-2" />
            <Text style={{ color: colors.text }} className="font-extrabold text-base">Back to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
