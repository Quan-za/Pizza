import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useOrders } from '../../../providers/OrderProvider';
import { useTheme } from '../../../providers/ThemeProvider';
import { useRouter } from 'expo-router';
import { Plus, Edit3, Sparkles } from 'lucide-react-native';
import { Product } from '../../../types';

export default function AdminProductsScreen() {
  const { products } = useOrders();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

  const renderAdminProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/admin-products/${item.id}`)}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      className="flex-1 m-2 rounded-3xl p-3 border"
    >
      <View className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-50 dark:bg-slate-900 justify-center items-center">
        <Image
          source={{ uri: item.image || defaultImage }}
          className="w-11/12 h-11/12"
          resizeMode="contain"
        />
        <View className="absolute top-2 right-2 bg-slate-900/60 p-1.5 rounded-full">
          <Edit3 size={12} color="white" />
        </View>
      </View>
      
      <Text
        style={{ color: colors.text }}
        className="font-bold text-sm mb-1"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      
      <Text style={{ color: colors.primary }} className="font-extrabold text-sm mt-auto">
        ${item.price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      <View className="flex-1 px-4" style={{ paddingTop: Platform.OS === 'android' ? 40 : 10 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text style={{ color: colors.text }} className="text-3xl font-black tracking-tight">
              Manage Menu
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-sm">
              Add new pizzas, modify pricing, or delete items.
            </Text>
          </View>
        </View>

        {/* Catalog list */}
        <FlatList
          data={products}
          renderItem={renderAdminProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="flex-row items-center mb-4">
              <Sparkles size={16} color={colors.primary} className="mr-1.5" />
              <Text style={{ color: colors.text }} className="text-base font-extrabold">
                Active Catalog ({products.length} items)
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View className="py-20 items-center justify-center">
              <Text style={{ color: colors.textMuted }} className="text-base font-semibold">
                No items in inventory.
              </Text>
            </View>
          }
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={() => router.push('/admin-products/new')}
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
          className="absolute right-6 bottom-6 w-14 h-14 rounded-full items-center justify-center"
        >
          <Plus size={24} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
