import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, ActivityIndicator, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../../../providers/OrderProvider';
import { useTheme } from '../../../providers/ThemeProvider';
import { ChevronLeft, Save, Trash2, Camera, AlertCircle } from 'lucide-react-native';

export default function AdminProductFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products, createProduct, updateProduct, deleteProduct } = useOrders();
  const { colors } = useTheme();

  const isNew = id === 'new';
  const productId = Number(id);
  const existingProduct = products.find((p) => p.id === productId);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState('');

  // Load existing details if in edit mode
  useEffect(() => {
    if (!isNew && existingProduct) {
      setName(existingProduct.name);
      setPrice(existingProduct.price.toString());
      setImage(existingProduct.image || '');
    }
  }, [id, existingProduct, isNew]);

  const handleSave = () => {
    setFormError('');

    if (name.trim() === '') {
      setFormError('Product name is required!');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError('Please enter a valid price (greater than 0)!');
      return;
    }

    const productPayload = {
      name: name.trim(),
      price: parsedPrice,
      image: image.trim() !== '' ? image.trim() : null,
    };

    if (isNew) {
      createProduct(productPayload);
    } else {
      updateProduct({
        id: productId,
        ...productPayload,
      });
    }

    router.back();
  };

  const handleDelete = () => {
    // In a mock environment we'll delete directly and navigate back
    if (existingProduct) {
      deleteProduct(existingProduct.id);
      router.replace('/admin-products');
    }
  };

  const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

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
          {isNew ? 'Create Pizza' : 'Edit Details'}
        </Text>

        {!isNew ? (
          <TouchableOpacity
            onPress={handleDelete}
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            className="p-3 rounded-full"
          >
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>
        ) : (
          <View className="w-11 h-11" />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
        {/* Form Error Banner */}
        {formError !== '' && (
          <View className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-3xl mb-6 flex-row items-center">
            <AlertCircle size={20} color="#ef4444" className="mr-2" />
            <Text className="text-rose-500 text-sm font-semibold flex-1">{formError}</Text>
          </View>
        )}

        {/* Thumbnail Preview Card */}
        <View className="items-center mb-6">
          <View
            style={{ backgroundColor: colors.card, borderColor: colors.border }}
            className="w-48 h-48 rounded-3xl justify-center items-center overflow-hidden border relative"
          >
            <Image
              source={{ uri: image.trim() !== '' ? image.trim() : defaultImage }}
              className="w-10/12 h-10/12"
              resizeMode="contain"
            />
            <View className="absolute bottom-2 right-2 bg-slate-900/70 p-2 rounded-full">
              <Camera size={14} color="white" />
            </View>
          </View>
          <Text style={{ color: colors.textMuted }} className="text-xs mt-2 font-medium">
            Live catalog image preview
          </Text>
        </View>

        {/* Input Fields */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="p-6 rounded-3xl border mb-6"
        >
          {/* Product Name */}
          <View className="mb-5">
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
              Pizza Name
            </Text>
            <TextInput
              placeholder="e.g. Buffalo Chicken Pizza"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              style={{ color: colors.text, backgroundColor: colors.background, borderColor: colors.border }}
              className="px-4 py-3.5 rounded-2xl border text-sm font-semibold"
            />
          </View>

          {/* Pricing */}
          <View className="mb-5">
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
              Base Price ($)
            </Text>
            <TextInput
              placeholder="e.g. 12.99"
              placeholderTextColor={colors.textMuted}
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              style={{ color: colors.text, backgroundColor: colors.background, borderColor: colors.border }}
              className="px-4 py-3.5 rounded-2xl border text-sm font-semibold"
            />
          </View>

          {/* Image URL */}
          <View className="mb-2">
            <Text style={{ color: colors.textMuted }} className="text-xs font-bold mb-1.5 ml-1">
              Image URL
            </Text>
            <TextInput
              placeholder="Paste image link here"
              placeholderTextColor={colors.textMuted}
              value={image}
              onChangeText={setImage}
              style={{ color: colors.text, backgroundColor: colors.background, borderColor: colors.border }}
              className="px-4 py-3.5 rounded-2xl border text-xs font-semibold"
            />
          </View>
        </View>

        {/* Save CTA */}
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
          className="py-4 rounded-3xl flex-row items-center justify-center mb-10"
        >
          <Save size={18} color="white" className="mr-2" strokeWidth={2.5} />
          <Text className="text-white font-extrabold text-base">
            {isNew ? 'Create New Pizza' : 'Save Inventory'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
