import React, { createContext, useContext, useState } from 'react';
import { Order, OrderStatus, CartItem, Product } from '../types';
import initialProducts from '../assets/images/data/products';
import initialOrders from '../assets/images/data/orders';

type OrderContextType = {
  orders: Order[];
  products: Product[];
  createOrder: (cartItems: CartItem[], total: number) => Order;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;
  createProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // Format initial orders so they map correctly to the products in state
  const formattedInitialOrders: Order[] = initialOrders.map((o) => ({
    ...o,
    order_items: o.order_items?.map((item) => {
      // Find current product in initialProducts
      const matchedProd = initialProducts.find((p) => p.id === item.product_id) || item.products;
      return {
        ...item,
        products: matchedProd,
      };
    }),
  }));

  const [orders, setOrders] = useState<Order[]>(formattedInitialOrders);

  const createOrder = (cartItems: CartItem[], total: number): Order => {
    const newOrder: Order = {
      id: Math.floor(10000 + Math.random() * 90000),
      created_at: new Date().toISOString(),
      total,
      user_id: 'usr-782',
      status: 'New',
      order_items: cartItems.map((item, index) => ({
        id: index + 1,
        order_id: 0, // will be set later or ignored for mock
        product_id: item.product_id,
        products: item.product,
        size: item.size,
        quantity: item.quantity,
        toppings: item.toppings,
      })),
    };

    newOrder.order_items = newOrder.order_items?.map((item) => ({
      ...item,
      order_id: newOrder.id,
    }));

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      })
    );
  };

  const createProduct = (newProduct: Omit<Product, 'id'>) => {
    const id = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    setProducts((prev) => [...prev, { ...newProduct, id }]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        products,
        createOrder,
        updateOrderStatus,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
