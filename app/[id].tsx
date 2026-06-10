import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../providers/OrderProvider';
import { useCart } from '../providers/CartProvider';
import { useTheme } from '../providers/ThemeProvider';
import { Heart, ChevronLeft, Plus, Minus, Check } from 'lucide-react-native';
import { PizzaSize } from '../types';

const SIZES: PizzaSize[] = ['S', 'M', 'L', 'XL'];
const AVAILABLE_TOPPINGS = [
  { name: 'Extra Cheese', price: 1.0 },
  { name: 'Pepperoni', price: 1.0 },
  { name: 'Mushrooms', price: 1.0 },
  { name: 'Onions', price: 1.0 },
  { name: 'Bell Peppers', price: 1.0 },
  { name: 'Bacon', price: 1.5 },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products } = useOrders();
  const { addItem } = useCart();
  const { colors, isDark } = useTheme();

  const product = products.find((p) => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1 justify-center items-center">
        <Text style={{ color: colors.text }} className="text-lg font-bold">Product not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 bg-orange-500 rounded-full">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Handle topping toggle
  const toggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  // Calculate live single item price
  const basePrice = product.price;
  let sizeMultiplier = 1;
  if (selectedSize === 'S') sizeMultiplier = 0.8;
  if (selectedSize === 'M') sizeMultiplier = 1.0;
  if (selectedSize === 'L') sizeMultiplier = 1.2;
  if (selectedSize === 'XL') sizeMultiplier = 1.4;

  const toppingsCost = selectedToppings.reduce((sum, topName) => {
    const top = AVAILABLE_TOPPINGS.find((t) => t.name === topName);
    return sum + (top ? top.price : 0);
  }, 0);

  const singleItemPrice = basePrice * sizeMultiplier + toppingsCost;
  const totalPrice = singleItemPrice * quantity;

  // Add to cart and navigate back
  const handleAddToCart = () => {
    // Add multiple quantities
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedToppings);
    }
    router.back();
  };

  const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

  return (
    <SafeAreaView style={{ backgroundColor: colors.background }} className="flex-1">
      {/* Header Bar */}
      <View className="flex-row justify-between items-center px-4 py-3 z-10" style={{ paddingTop: Platform.OS === 'android' ? 35 : 10 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-3 rounded-full border"
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={{ color: colors.text }} className="text-lg font-bold">
          Customize Pizza
        </Text>

        <TouchableOpacity
          onPress={() => setIsFavorite(!isFavorite)}
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-3 rounded-full border"
        >
          <Heart size={20} color={isFavorite ? 'red' : colors.text} fill={isFavorite ? 'red' : 'transparent'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Product Image Section */}
        <View className="items-center justify-center py-6 px-4">
          <View
            style={{
              backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: isDark ? 0.4 : 0.1,
              shadowRadius: 20,
              elevation: 10,
            }}
            className="w-72 h-72 rounded-full justify-center items-center overflow-hidden"
          >
            <Image
              source={{ uri: product.image || defaultImage }}
              className="w-11/12 h-11/12"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Product Info Block */}
        <View
          style={{ backgroundColor: colors.card }}
          className="flex-1 rounded-t-[40px] px-6 pt-8 pb-10 -mt-6 border-t border-slate-100 dark:border-slate-800"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text style={{ color: colors.text }} className="text-2xl font-black mb-1">
                {product.name}
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-sm">
                Wood-fired premium artisan crust with specialty tomato sauce and signature herbs.
              </Text>
            </View>
            <Text style={{ color: colors.primary }} className="text-2xl font-black">
              ${singleItemPrice.toFixed(2)}
            </Text>
          </View>

          {/* Sizing Selector */}
          <View className="mb-6">
            <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
              Select Size
            </Text>
            <View className="flex-row justify-between bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {SIZES.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={{
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    }}
                    className="flex-1 py-3 rounded-xl items-center justify-center"
                  >
                    <Text
                      style={{
                        color: isSelected ? 'white' : colors.text,
                        fontWeight: isSelected ? 'bold' : '600',
                      }}
                      className="text-sm"
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Toppings Checklist */}
          <View className="mb-6">
            <Text style={{ color: colors.text }} className="text-base font-extrabold mb-3">
              Extra Toppings (+$1.00 each)
            </Text>
            <View className="flex-row flex-wrap -mx-1">
              {AVAILABLE_TOPPINGS.map((top) => {
                const isSelected = selectedToppings.includes(top.name);
                return (
                  <TouchableOpacity
                    key={top.name}
                    onPress={() => toggleTopping(top.name)}
                    style={{
                      backgroundColor: isSelected ? colors.primaryLight : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                    }}
                    className="flex-row items-center m-1 px-4 py-2.5 rounded-2xl border"
                  >
                    <View
                      style={{
                        borderColor: isSelected ? colors.primary : colors.textMuted,
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                      }}
                      className="w-4 h-4 rounded-full border items-center justify-center mr-2"
                    >
                      {isSelected && <Check size={10} color="white" strokeWidth={4} />}
                    </View>
                    <Text
                      style={{
                        color: isSelected ? colors.primary : colors.text,
                        fontWeight: isSelected ? 'bold' : '600',
                      }}
                      className="text-xs"
                    >
                      {top.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Quantity and Checkout Row */}
          <View className="flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-6 mt-4">
            <View className="flex-row items-center bg-slate-100 dark:bg-slate-900 rounded-full px-2 py-1.5 border border-slate-200 dark:border-slate-800">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2"
              >
                <Minus size={16} color={colors.text} />
              </TouchableOpacity>
              <Text style={{ color: colors.text }} className="mx-4 font-extrabold text-base">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                className="p-2"
              >
                <Plus size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              style={{
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
              }}
              className="flex-1 ml-4 py-4 rounded-3xl flex-row items-center justify-center"
            >
              <Text className="text-white font-extrabold text-base mr-2">
                Add to Cart
              </Text>
              <Text className="text-white/80 font-semibold text-sm">
                • ${totalPrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}