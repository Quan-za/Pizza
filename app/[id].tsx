import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const ProductScreen = () => {

  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Product Details</Text>
    </View>
  );
}

export default ProductScreen;