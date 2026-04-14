import products from "@/assets/images/data/products";
import ProductListItem from "@/components/ProductListItem";
import { FlatList, StyleSheet, View } from "react-native";

export default function MenuScreen() {
  return (
    <View>
       {/* <ProductListItem product={products[5]} />
       <ProductListItem product={products[0]} />*/}
        <FlatList data={ products} 
        renderItem={ ({ item }) => <ProductListItem product={ item } />} 
        numColumns={2}
        />
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },

  image: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },

  title:{
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    fontSize: 16,
    color: "dodgerblue",
  }

});