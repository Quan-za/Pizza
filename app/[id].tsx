import products from '@/assets/images/data/products';
import { useLocalSearchParams } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductScreen = () => {

const { id } = useLocalSearchParams<{ id: string }>();

const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

// Convert to a number so you can do math
const productId = Number(id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: products[productId-1]?.image || defaultImage }} style={ styles.image } resizeMode="contain"/>
      <Text style={styles.size_header}>Select size: </Text>
      <Pressable>
        <View style={{ margin: 15, justifyContent: 'space-between', flexDirection: 'row' }}>
          <View style={{ backgroundColor: 'lightgray', padding: 10, height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.size}>S</Text>
          </View>
        </View>
      </Pressable>

      <Text style={{ fontWeight: 'bold' , marginLeft: 5, marginTop: 10 }}>$ {products[productId-1]?.price || 0}</Text>
      <View  style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity activeOpacity={0.8} style={styles.btnCart}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginLeft: 15 }}>
          <Heart color="red" size={28} />
        </TouchableOpacity>
      </View>
      
      <Text>Product ID: {id}</Text>
    </View>
  );
}

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    flex: 1,
    margin: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  title:{
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
  },
  size_header: {
    fontSize: 18,
    color: "gray",
  },
  size: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  btnCart: {
    flex: 1,
    backgroundColor: "dodgerblue",
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  }
});