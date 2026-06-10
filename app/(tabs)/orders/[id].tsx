import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../../../providers/OrderProvider';
import { useTheme } from '../../../providers/ThemeProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { ChevronLeft, Check, ChefHat, Bike, Gift, HelpCircle } from 'lucide-react-native';
import { OrderStatus } from '../../../types';

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
  { status: 'New', label: 'Placed', desc: 'Order received and confirmed', icon: Gift },
  { status: 'Cooking', label: 'Cooking', desc: 'Your pizza is in the oven', icon: ChefHat },
  { status: 'Delivering', label: 'Delivering', desc: 'Out for delivery', icon: Bike },
  { status: 'Delivered', label: 'Delivered', desc: 'Enjoy your hot pizza!', icon: Check },
];

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrders();
  const { colors, isDark } = useTheme();
  const { role } = useAuth();

  const order = orders.find((o) => o.id === Number(id));

  if (!order) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center">
        <Text style={{ color: colors.text }} className="text-lg font-bold">Order not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-orange-500 rounded-full">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Get active step index
  const activeIndex = STATUS_STEPS.findIndex((step) => step.status === order.status);

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStepColor = (index: number) => {
    if (index <= activeIndex) {
      if (order.status === 'Delivered') return colors.success; // Delivered gets green
      return colors.primary; // Active gets primary theme orange
    }
    return colors.border;
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b" style={{ borderColor: colors.border, paddingTop: Platform.OS === 'android' ? 35 : 10 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-3 rounded-full border"
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={{ color: colors.text }} className="text-lg font-black">
          Order Status
        </Text>

        <View className="w-11 h-11" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* Info card */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl border mb-6"
        >
          <View className="flex-row justify-between items-center mb-3">
            <Text style={{ color: colors.text }} className="font-extrabold text-base">
              Order #{order.id}
            </Text>
            <Text className="text-emerald-500 font-extrabold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Mock Payment Paid
            </Text>
          </View>
          <Text style={{ color: colors.textMuted }} className="text-xs">
            Placed on {formatDate(order.created_at)}
          </Text>
        </View>

        {/* Visual Stepper Tracker */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-6 rounded-3xl border mb-6"
        >
          <Text style={{ color: colors.text }} className="text-base font-black mb-6">
            Live Delivery Tracker
          </Text>

          <View className="ml-2">
            {STATUS_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isPastOrActive = index <= activeIndex;
              const isLast = index === STATUS_STEPS.length - 1;
              const iconColor = isPastOrActive ? 'white' : colors.textMuted;
              const stepColor = getStepColor(index);

              return (
                <View key={step.status} className="flex-row mb-6 relative">
                  {/* Vertical Line */}
                  {!isLast && (
                    <View
                      style={{
                        backgroundColor: index < activeIndex ? getStepColor(index + 1) : colors.border,
                        width: 2,
                        position: 'absolute',
                        left: 17,
                        top: 36,
                        bottom: -24,
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Icon Indicator */}
                  <View
                    style={{
                      backgroundColor: stepColor,
                      zIndex: 2,
                      shadowColor: stepColor,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isPastOrActive ? 0.3 : 0,
                      shadowRadius: 6,
                    }}
                    className="w-9 h-9 rounded-full items-center justify-center mr-4"
                  >
                    <StepIcon size={18} color={iconColor} strokeWidth={2.5} />
                  </View>

                  {/* Text Details */}
                  <View className="flex-1 justify-center">
                    <Text
                      style={{
                        color: isPastOrActive ? colors.text : colors.textMuted,
                        fontWeight: isPastOrActive ? 'bold' : '600',
                      }}
                      className="text-sm"
                    >
                      {step.label}
                    </Text>
                    {isPastOrActive && (
                      <Text style={{ color: colors.textMuted }} className="text-xs mt-0.5">
                        {step.desc}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Order Details List */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl border mb-6"
        >
          <Text style={{ color: colors.text }} className="text-base font-black mb-4">
            Items Summary
          </Text>

          {order.order_items?.map((item) => {
            const toppingCost = (item.toppings?.length || 0) * 1.0;
            const basePrice = item.products?.price || 0;
            let sizeMultiplier = 1;
            if (item.size === 'S') sizeMultiplier = 0.8;
            if (item.size === 'M') sizeMultiplier = 1.0;
            if (item.size === 'L') sizeMultiplier = 1.2;
            if (item.size === 'XL') sizeMultiplier = 1.4;

            const itemPrice = basePrice * sizeMultiplier + toppingCost;

            return (
              <View
                key={item.id}
                className="flex-row justify-between py-3 border-b last:border-0"
                style={{ borderColor: colors.border }}
              >
                <View className="flex-1 pr-4">
                  <Text style={{ color: colors.text }} className="font-bold text-sm">
                    {item.quantity}x {item.products?.name || 'Specialty Pizza'} ({item.size})
                  </Text>
                  {item.toppings && item.toppings.length > 0 && (
                    <Text style={{ color: colors.primary }} className="text-[10px] font-semibold mt-0.5">
                      + {item.toppings.join(', ')}
                    </Text>
                  )}
                </View>
                <Text style={{ color: colors.text }} className="font-bold text-sm">
                  ${(itemPrice * item.quantity).toFixed(2)}
                </Text>
              </View>
            );
          })}

          <View className="flex-row justify-between pt-4 mt-2">
            <Text style={{ color: colors.text }} className="font-black text-base">
              Grand Total
            </Text>
            <Text style={{ color: colors.primary }} className="font-black text-base">
              ${order.total.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Admin Controls Panel */}
        {role === 'admin' && (
          <View
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="p-5 rounded-3xl border mb-8"
          >
            <Text style={{ color: colors.text }} className="text-base font-black mb-4">
              Admin Status Control
            </Text>
            
            <View className="flex-row flex-wrap -mx-1">
              {(['New', 'Cooking', 'Delivering', 'Delivered'] as OrderStatus[]).map((status) => {
                const isCurrent = order.status === status;
                return (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleUpdateStatus(status)}
                    style={{
                      backgroundColor: isCurrent ? colors.primary : colors.background,
                      borderColor: isCurrent ? colors.primary : colors.border,
                    }}
                    className="flex-1 m-1 py-3 rounded-2xl border items-center justify-center"
                  >
                    <Text
                      style={{
                        color: isCurrent ? 'white' : colors.text,
                        fontWeight: isCurrent ? 'bold' : '600',
                      }}
                      className="text-xs"
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
