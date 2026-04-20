import products from '@/assets/images/data/products';
import { useLocalSearchParams } from 'expo-router';
import { Heart } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductScreen = () => {

const { id } = useLocalSearchParams<{ id: string }>();
const [fav, setFav] = useState(false);

const [selectedSize, setSize] = useState('');
const sizes = ['S', 'M', 'L', 'XL'];

const defaultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

// Convert to a number so you can do math
const productId = Number(id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: products[productId-1]?.image || defaultImage }} style={ styles.image } resizeMode="contain"/>
      <Text style={styles.size_header}>Select size: </Text>
      
         <View className="flex-row justify-between margin-15">
            { sizes.map((size, index) => (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSize(size)}>
              <View key={index} className={`${selectedSize === size ? 'border-sky-600' : 'border-transparent'}`} style={styles.size}>
                <Text style={{ fontSize: 16, color: "black", fontWeight: "bold" }}>{ size }</Text>
              </View>
              </TouchableOpacity>
            ))}
          </View>
      
      <Text className='text-lg font-bold ml-2 mt-5'>$ {products[productId-1]?.price || 0}</Text>
      <View  className='flex-row items-center justify-center'>
        <TouchableOpacity activeOpacity={0.8} style={styles.btnCart}>
            <Text className='text-white font-bold'>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFav(!fav)} activeOpacity={0.8} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ margin: 15 }}>
          <Heart color="red" size={28} fill={fav ? "red" : "white"} />
        </TouchableOpacity>
      </View>
      
      <Text className='text-lg ml-2 mt-2'>Product ID: {id}</Text>
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
    backgroundColor: 'lightgray',
    padding: 10, 
    height: 50, 
    width: 50, 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2   },
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