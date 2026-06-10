import React, { useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Platform, Dimensions } from 'react-native';
import { useOrders } from '../../providers/OrderProvider';
import { useCart } from '../../providers/CartProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../providers/AuthProvider';
import { Link } from 'expo-router';
import { Search, ShoppingBag, Flame, Sparkles, Plus } from 'lucide-react-native';
import { Product } from '../../types';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Pizza', 'Pasta', 'Sides', 'Drinks'];

export default function MenuScreen() {
  const { products } = useOrders();
  const { items } = useCart();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart item count calculation
  const totalCartQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Pizza' && product.name.toLowerCase().includes('pizza') || product.name.toLowerCase().includes('pepperoni') || product.name.toLowerCase().includes('extravaganzza') || product.name.toLowerCase().includes('meatzza') || product.name.toLowerCase().includes('margarita') || product.name.toLowerCase().includes('veggie') || product.name.toLowerCase().includes('hawaiian') || product.name.toLowerCase().includes('deluxe') || product.name.toLowerCase().includes('cheese')) ||
      (selectedCategory === 'Pasta' && product.name.toLowerCase().includes('pasta')) ||
      (selectedCategory === 'Sides' && product.name.toLowerCase().includes('sides') || product.name.toLowerCase().includes('bread')) ||
      (selectedCategory === 'Drinks' && product.name.toLowerCase().includes('drink') || product.name.toLowerCase().includes('cola') || product.name.toLowerCase().includes('water'));
    return matchesSearch && matchesCategory;
  });

  // Featured products (e.g., first 3 products)
  const featuredProducts = products.slice(0, 3);

  const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

  const renderProductItem = ({ item }: { item: Product }) => (
    <Link href={`/${item.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.9}
        className="flex-1 m-2 rounded-3xl p-3 border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-50 dark:bg-slate-900 justify-center items-center">
          <Image
            source={{ uri: item.image || defaultImage }}
            className="w-11/12 h-11/12"
            resizeMode="contain"
          />
          {item.price > 13 && (
            <View className="absolute top-2 left-2 flex-row items-center bg-orange-500 rounded-full px-2 py-1">
              <Flame size={12} color="white" />
              <Text className="text-[10px] font-bold text-white ml-1">POPULAR</Text>
            </View>
          )}
        </View>
        
        <Text
          style={{ color: colors.text }}
          className="font-bold text-base mb-1"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        
        <View className="flex-row items-center justify-between mt-auto">
          <Text style={{ color: colors.primary }} className="font-extrabold text-base">
            ${item.price.toFixed(2)}
          </Text>
          <View
            style={{ backgroundColor: colors.primaryLight }}
            className="p-1.5 rounded-full"
          >
            <Plus size={16} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      <View className="flex-1 px-4" style={{ paddingTop: Platform.OS === 'android' ? 40 : 10 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text style={{ color: colors.textMuted }} className="text-sm font-semibold">
              Deliver to
            </Text>
            <Text style={{ color: colors.text }} className="text-base font-extrabold">
              {user ? 'My Sweet Home 📍' : 'Guest Location 📍'}
            </Text>
          </View>
          
          <Link href="/cart" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ backgroundColor: colors.card, borderColor: colors.border }}
              className="p-3 rounded-full relative border"
            >
              <ShoppingBag size={22} color={colors.text} />
              {totalCartQuantity > 0 && (
                <View className="absolute -top-1 -right-1 bg-orange-500 rounded-full h-5 min-w-[20px] px-1 items-center justify-center border-2 border-white dark:border-slate-950">
                  <Text className="text-[10px] font-black text-white">
                    {totalCartQuantity}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Link>
        </View>

        {/* Welcome Text */}
        <View className="mb-4">
          <Text style={{ color: colors.text }} className="text-3xl font-black tracking-tight">
            Craving Premium Pizza?
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm">
            Handcrafted with love, delivered in minutes.
          </Text>
        </View>

        {/* Search Bar */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="flex-row items-center px-4 py-3 rounded-2xl mb-6 border"
        >
          <Search size={20} color={colors.textMuted} className="mr-2" />
          <TextInput
            placeholder="Search pizza, pasta, drinks..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: colors.text }}
            className="flex-1 text-sm font-medium py-0"
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Featured / Carousel Section */}
              {searchQuery === '' && selectedCategory === 'All' && (
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Sparkles size={18} color={colors.primary} />
                    <Text style={{ color: colors.text }} className="text-lg font-bold ml-1.5">
                      Chef's Specials
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="-mx-4 px-4"
                  >
                    {featuredProducts.map((prod) => (
                      <Link key={prod.id} href={`/${prod.id}`} asChild>
                        <TouchableOpacity
                          activeOpacity={0.95}
                          style={{
                            backgroundColor: colors.primary,
                            width: width * 0.75,
                            shadowColor: colors.primary,
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.3,
                            shadowRadius: 10,
                            elevation: 5,
                          }}
                          className="mr-4 rounded-3xl p-4 flex-row items-center justify-between relative overflow-hidden"
                        >
                          {/* Accent circle */}
                          <View className="absolute -right-10 -bottom-10 bg-orange-400 opacity-20 w-40 h-40 rounded-full" />
                          
                          <View className="flex-1 z-10 pr-2">
                            <Text className="text-white text-xs font-black bg-white/20 self-start px-2 py-1 rounded-full mb-2">
                              20% OFF TODAY
                            </Text>
                            <Text className="text-white text-lg font-black leading-tight mb-1" numberOfLines={2}>
                              {prod.name}
                            </Text>
                            <Text className="text-white/80 text-xs mb-3" numberOfLines={1}>
                              Premium crust & rich toppings
                            </Text>
                            <Text className="text-white text-xl font-black">
                              ${prod.price.toFixed(2)}
                            </Text>
                          </View>
                          
                          <View className="w-28 h-28 items-center justify-center bg-white/10 rounded-full">
                            <Image
                              source={{ uri: prod.image || defaultImage }}
                              className="w-24 h-24"
                              resizeMode="contain"
                            />
                          </View>
                        </TouchableOpacity>
                      </Link>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Categories */}
              <View className="mb-4">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="-mx-4 px-4"
                >
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        style={{
                          backgroundColor: isSelected ? colors.primary : colors.card,
                          borderColor: isSelected ? colors.primary : colors.border,
                        }}
                        className="mr-3 px-5 py-2.5 rounded-full border"
                      >
                        <Text
                          style={{
                            color: isSelected ? 'white' : colors.text,
                            fontWeight: isSelected ? 'bold' : '600',
                          }}
                          className="text-xs"
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Grid Header */}
              <View className="flex-row justify-between items-center mb-3">
                <Text style={{ color: colors.text }} className="text-lg font-bold">
                  {selectedCategory} Menu
                </Text>
                <Text style={{ color: colors.textMuted }} className="text-xs">
                  {filteredProducts.length} items found
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View className="py-10 items-center justify-center">
              <Text style={{ color: colors.textMuted }} className="text-base font-semibold">
                No items match your filters.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
