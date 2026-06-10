import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useOrders } from '../../../providers/OrderProvider';
import { useTheme } from '../../../providers/ThemeProvider';
import { useAuth } from '../../../providers/AuthProvider';
import { Link } from 'expo-router';
import { ChevronRight, Clock, PackageCheck } from 'lucide-react-native';
import { Order, OrderStatus } from '../../../types';

export default function OrdersIndexScreen() {
  const { orders } = useOrders();
  const { colors } = useTheme();
  const { role } = useAuth();

  // Filter orders based on role and active vs past
  // Admin sees all orders, normal user sees only theirs (in this mock, all orders share user_id '1' or 'usr-782')
  const myOrders = role === 'admin' ? orders : orders.filter(o => o.user_id === 'usr-782' || o.user_id === '1');

  const activeOrders = myOrders.filter(
    (o) => o.status === 'New' || o.status === 'Cooking' || o.status === 'Delivering'
  );
  
  const pastOrders = myOrders.filter((o) => o.status === 'Delivered');

  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case 'New':
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', text: 'New' };
      case 'Cooking':
        return { color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', text: 'Cooking' };
      case 'Delivering':
        return { color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', text: 'Delivering' };
      case 'Delivered':
        return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', text: 'Delivered' };
      default:
        return { color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)', text: 'Unknown' };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const statusInfo = getStatusDetails(item.status);
    const dateStr = formatDate(item.created_at);
    
    // Create items summary string
    const itemsSummary = item.order_items
      ?.map((oi) => `${oi.quantity}x ${oi.products?.name || 'Pizza'} (${oi.size})`)
      .join(', ') || 'No details available';

    return (
      <Link href={`/orders/${item.id}`} asChild>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-5 rounded-3xl mb-4 border flex-row items-center justify-between"
        >
          <View className="flex-1 pr-4">
            {/* Header row */}
            <View className="flex-row items-center mb-2 flex-wrap">
              <Text style={{ color: colors.text }} className="font-extrabold text-sm mr-2">
                Order #{item.id}
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-xs mr-3">
                {dateStr}
              </Text>
              
              <View
                style={{ backgroundColor: statusInfo.bg }}
                className="px-2.5 py-0.5 rounded-full"
              >
                <Text
                  style={{ color: statusInfo.color }}
                  className="text-[10px] font-bold"
                >
                  {statusInfo.text}
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text style={{ color: colors.textMuted }} className="text-xs mb-3" numberOfLines={1}>
              {itemsSummary}
            </Text>

            {/* Price */}
            <Text style={{ color: colors.primary }} className="font-black text-sm">
              Total: ${item.total.toFixed(2)}
            </Text>
          </View>
          
          <ChevronRight size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </Link>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="flex-1 px-4" style={{ paddingTop: Platform.OS === 'android' ? 40 : 10 }}>
        
        {/* Title */}
        <View className="mb-6">
          <Text style={{ color: colors.text }} className="text-3xl font-black tracking-tight">
            {role === 'admin' ? 'Kitchen Queue' : 'My Orders'}
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm">
            {role === 'admin' 
              ? 'Real-time kitchen fulfillment status' 
              : 'Review and track your active and past orders.'}
          </Text>
        </View>

        {/* Section divider and rendering */}
        <FlatList
          data={activeOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            activeOrders.length > 0 ? (
              <View className="flex-row items-center mb-3">
                <Clock size={16} color={colors.primary} className="mr-1.5" />
                <Text style={{ color: colors.text }} className="text-base font-extrabold">
                  Active Orders ({activeOrders.length})
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            <View className="mt-4 mb-8">
              {pastOrders.length > 0 && (
                <>
                  <View className="flex-row items-center mb-3 mt-2">
                    <PackageCheck size={16} color={colors.textMuted} className="mr-1.5" />
                    <Text style={{ color: colors.text }} className="text-base font-extrabold">
                      Past Orders ({pastOrders.length})
                    </Text>
                  </View>
                  <FlatList
                    data={pastOrders}
                    renderItem={renderOrderCard}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                  />
                </>
              )}
            </View>
          }
          ListEmptyComponent={
            activeOrders.length === 0 && pastOrders.length === 0 ? (
              <View className="py-20 items-center justify-center">
                <Text style={{ color: colors.textMuted }} className="text-base font-semibold text-center mb-4">
                  No orders found.
                </Text>
                {role !== 'admin' && (
                  <Link href="/(tabs)" asChild>
                    <TouchableOpacity
                      style={{ backgroundColor: colors.primary }}
                      className="px-6 py-3 rounded-full"
                    >
                      <Text className="text-white font-bold text-xs">Order Now</Text>
                    </TouchableOpacity>
                  </Link>
                )}
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
