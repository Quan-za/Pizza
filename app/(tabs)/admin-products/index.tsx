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
        flex: 1,
        margin: 8,
        borderRadius: 24,
        padding: 12,
        borderWidth: 1,
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <View style={{ position: 'relative', width: '100%', aspectRatio: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 12, backgroundColor: isDark ? '#0f172a' : '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={{ uri: item.image || defaultImage }}
          style={{ width: '91.67%', height: '91.67%' }}
          resizeMode="contain"
        />
        <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: 6, borderRadius: 999 }}>
          <Edit3 size={12} color="white" />
        </View>
      </View>
      
      <Text
        style={{ color: colors.text, fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}
        numberOfLines={1}
      >
        {item.name}
      </Text>
      
      <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14, marginTop: 'auto' }}>
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
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
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
