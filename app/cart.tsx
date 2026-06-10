import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Modal, ActivityIndicator, Platform } from 'react-native';
import { useCart } from '../providers/CartProvider';
import { useOrders } from '../providers/OrderProvider';
import { useTheme } from '../providers/ThemeProvider';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, Minus, Trash2, Ticket, Check, X, CreditCard } from 'lucide-react-native';
import { CartItem } from '../types';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, promoCode, applyPromoCode, subtotal, discount, deliveryFee, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  
  // Checkout sheet modal states
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess(false);
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoSuccess(true);
    } else {
      setPromoError('Invalid coupon code!');
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate payment processing for 1.5 seconds
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutVisible(false);
      // Create the order in context
      const newOrder = createOrder(items, total);
      // Clear the cart
      clearCart();
      // Navigate to success screen
      router.push({
        pathname: '/checkout-success',
        params: { orderId: newOrder.id }
      });
    }, 1500);
  };

  const getItemPrice = (item: CartItem) => {
    const toppingCost = item.toppings.length * 1.0;
    const basePrice = item.product.price;
    let sizeMultiplier = 1;
    if (item.size === 'S') sizeMultiplier = 0.8;
    if (item.size === 'M') sizeMultiplier = 1.0;
    if (item.size === 'L') sizeMultiplier = 1.2;
    if (item.size === 'XL') sizeMultiplier = 1.4;

    return basePrice * sizeMultiplier + toppingCost;
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemPrice = getItemPrice(item);
    return (
      <View
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
        className="flex-row items-center p-3 rounded-3xl mb-3 border"
      >
        {/* Product Image */}
        <View className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 justify-center items-center overflow-hidden">
          <Image
            source={{ uri: item.product.image || defaultImage }}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>

        {/* Product Info */}
        <View className="flex-1 ml-3 pr-2">
          <Text style={{ color: colors.text }} className="font-bold text-sm" numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-xs">
            Size: {item.size}
          </Text>
          {item.toppings.length > 0 && (
            <Text style={{ color: colors.primary }} className="text-[10px] font-semibold mt-0.5" numberOfLines={1}>
              + {item.toppings.join(', ')}
            </Text>
          )}
          <Text style={{ color: colors.text }} className="font-extrabold text-sm mt-1">
            ${(itemPrice * item.quantity).toFixed(2)}
          </Text>
        </View>

        {/* Quantity Controls & Remove */}
        <View className="items-end">
          <TouchableOpacity
            onPress={() => removeItem(item.id)}
            className="p-1 mb-2"
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
          
          <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-full px-1 py-0.5 border border-slate-100 dark:border-slate-800">
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, -1)}
              className="p-1.5"
            >
              <Minus size={12} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ color: colors.text }} className="mx-2 font-bold text-xs">
              {item.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, 1)}
              className="p-1.5"
            >
              <Plus size={12} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
          Shopping Cart
        </Text>

        <View className="w-11 h-11" />
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' }}
            className="w-48 h-48 rounded-full mb-6 opacity-80"
          />
          <Text style={{ color: colors.text }} className="text-xl font-bold text-center mb-2">
            Your Cart is Empty
          </Text>
          <Text style={{ color: colors.textMuted }} className="text-sm text-center mb-6">
            Looks like you haven't added any pizzas to your cart yet. Let's find something delicious!
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.primary }}
            className="px-8 py-4 rounded-3xl"
          >
            <Text className="text-white font-extrabold">Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            ListFooterComponent={
              <View className="mt-4">
                {/* Promo Code Input */}
                <View
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                  className="flex-row items-center p-3 rounded-3xl border mb-4"
                >
                  <Ticket size={20} color={colors.textMuted} className="mr-2" />
                  <TextInput
                    placeholder="Enter Coupon (PIZZA20)"
                    placeholderTextColor={colors.textMuted}
                    value={promoInput}
                    onChangeText={setPromoInput}
                    style={{ color: colors.text }}
                    className="flex-1 text-sm font-semibold py-0"
                  />
                  <TouchableOpacity
                    onPress={handleApplyPromo}
                    style={{ backgroundColor: colors.primary }}
                    className="px-4 py-2 rounded-2xl"
                  >
                    <Text className="text-white font-bold text-xs">Apply</Text>
                  </TouchableOpacity>
                </View>

                {/* Promo Feedback Messages */}
                {promoSuccess && (
                  <View className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl mb-4 flex-row items-center">
                    <Check size={16} color="#10b981" />
                    <Text className="text-emerald-500 text-xs font-bold ml-2">
                      Coupon applied successfully! 20% discount saved.
                    </Text>
                  </View>
                )}
                {promoError !== '' && (
                  <View className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl mb-4 flex-row items-center">
                    <X size={16} color="#ef4444" />
                    <Text className="text-rose-500 text-xs font-bold ml-2">{promoError}</Text>
                  </View>
                )}

                {/* Price Breakdown */}
                <View
                  style={{ backgroundColor: colors.card, borderColor: colors.border }}
                  className="p-5 rounded-3xl border mb-6"
                >
                  <View className="flex-row justify-between mb-3">
                    <Text style={{ color: colors.textMuted }} className="font-semibold text-sm">
                      Subtotal
                    </Text>
                    <Text style={{ color: colors.text }} className="font-bold text-sm">
                      ${subtotal.toFixed(2)}
                    </Text>
                  </View>
                  
                  {promoCode !== '' && (
                    <View className="flex-row justify-between mb-3">
                      <Text style={{ color: colors.textMuted }} className="font-semibold text-sm">
                        Discount (20%)
                      </Text>
                      <Text className="text-emerald-500 font-bold text-sm">
                        -${discount.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  
                  <View className="flex-row justify-between mb-3">
                    <Text style={{ color: colors.textMuted }} className="font-semibold text-sm">
                      Delivery Fee
                    </Text>
                    <Text style={{ color: colors.text }} className="font-bold text-sm">
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </Text>
                  </View>
                  
                  {deliveryFee > 0 && (
                    <Text className="text-slate-400 dark:text-slate-500 text-[10px] text-right -mt-2 mb-3">
                      Add ${(30 - subtotal).toFixed(2)} more for free delivery
                    </Text>
                  )}

                  <View className="border-t border-slate-100 dark:border-slate-800 pt-3 flex-row justify-between">
                    <Text style={{ color: colors.text }} className="font-black text-base">
                      Total
                    </Text>
                    <Text style={{ color: colors.primary }} className="font-black text-lg">
                      ${total.toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Checkout CTA */}
                <TouchableOpacity
                  onPress={() => setCheckoutVisible(true)}
                  style={{
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                  className="py-4 rounded-3xl items-center justify-center mb-8"
                >
                  <Text className="text-white font-extrabold text-base">
                    Checkout (${total.toFixed(2)})
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}

      {/* Mock Payment Sheet Modal */}
      <Modal
        visible={checkoutVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View
            style={{ backgroundColor: colors.card }}
            className="rounded-t-[40px] p-6 border-t border-slate-100 dark:border-slate-800"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-xl font-black">
                Payment Method
              </Text>
              <TouchableOpacity
                onPress={() => setCheckoutVisible(false)}
                className="bg-slate-100 dark:bg-slate-900 p-2 rounded-full"
              >
                <X size={16} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Card Mock */}
            <View className="bg-slate-950 p-6 rounded-3xl mb-6 relative overflow-hidden">
              <View className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500 opacity-20 rounded-full" />
              <View className="absolute -left-6 -top-6 w-24 h-24 bg-red-500 opacity-10 rounded-full" />
              
              <View className="flex-row justify-between items-start mb-8 z-10">
                <View>
                  <Text className="text-white/60 text-[10px] font-bold tracking-wider">PREMIUM CARD</Text>
                  <Text className="text-white font-extrabold text-lg mt-1">Pizza Gold</Text>
                </View>
                <CreditCard size={28} color="white" />
              </View>
              
              <Text className="text-white text-base font-black tracking-[3px] mb-6 z-10">
                ••••  ••••  ••••  5299
              </Text>
              
              <View className="flex-row justify-between items-end z-10">
                <View>
                  <Text className="text-white/40 text-[8px] font-bold">CARD HOLDER</Text>
                  <Text className="text-white font-bold text-xs mt-0.5">Amos PizzaLover</Text>
                </View>
                <View className="items-end">
                  <Text className="text-white/40 text-[8px] font-bold">EXPIRES</Text>
                  <Text className="text-white font-bold text-xs mt-0.5">12 / 30</Text>
                </View>
              </View>
            </View>

            {/* Price Detail */}
            <View className="flex-row justify-between items-center mb-6 px-2">
              <View>
                <Text style={{ color: colors.textMuted }} className="text-xs font-semibold">
                  Amount to Pay
                </Text>
                <Text style={{ color: colors.text }} className="text-lg font-black">
                  ${total.toFixed(2)}
                </Text>
              </View>
              <Text className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full">
                Secured Checkout
              </Text>
            </View>

            {/* Confirm Payment button */}
            <TouchableOpacity
              onPress={handlePlaceOrder}
              disabled={isProcessing}
              style={{ backgroundColor: colors.primary }}
              className="py-4 rounded-3xl items-center justify-center flex-row mb-4"
            >
              {isProcessing ? (
                <>
                  <ActivityIndicator size="small" color="white" className="mr-2" />
                  <Text className="text-white font-extrabold">Authorizing Card...</Text>
                </>
              ) : (
                <Text className="text-white font-extrabold text-base">
                  Pay Now & Place Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
