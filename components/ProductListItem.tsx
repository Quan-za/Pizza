import { Product } from "@/types";
import { Link } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";


const defultImage = 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';
    
const ProductListItem = ({ product }: { product: Product }) => {
  return(
  <Link href={`/${product.id}`} asChild>
     <Pressable style={ styles.container }>
      <Image source={{ uri: product.image || defultImage }} style={ styles.image } resizeMode="contain"/>
      <Text style={ styles.title }>{ product.name }</Text>
      <Text style={ styles.price }>{ `$${product.price}` }</Text>
    </Pressable>
  </Link>
  );
}

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    flex: 1,
    margin: 10,
    maxWidth: '50%',
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
  price: {
    fontSize: 16,
    color: "dodgerblue",
  }
});