import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product, PizzaSize } from '../types';

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, size: PizzaSize, toppings: string[]) => void;
  updateQuantity: (cartItemId: string, amount: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');

  const addItem = (product: Product, size: PizzaSize, toppings: string[]) => {
    setItems((prev) => {
      // Find if we already have this exact product with same size and toppings
      const existingIndex = prev.findIndex(
        (item) =>
          item.product_id === product.id &&
          item.size === size &&
          JSON.stringify(item.toppings.sort()) === JSON.stringify(toppings.sort())
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }

      const newItem: CartItem = {
        id: `${product.id}-${size}-${toppings.sort().join('-')}-${Date.now()}`,
        product,
        product_id: product.id,
        size,
        quantity: 1,
        toppings,
      };

      return [...prev, newItem];
    });
  };

  const updateQuantity = (cartItemId: string, amount: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            return { ...item, quantity: item.quantity + amount };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
  };

  const applyPromoCode = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PIZZA20' || cleanCode === 'AMOS20') {
      setPromoCode(cleanCode);
      return true;
    }
    return false;
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    // Each topping adds $1.00
    const toppingCost = item.toppings.length * 1.0;
    const basePrice = item.product.price;
    // Size multiplier
    let sizeMultiplier = 1;
    if (item.size === 'S') sizeMultiplier = 0.8;
    if (item.size === 'M') sizeMultiplier = 1.0;
    if (item.size === 'L') sizeMultiplier = 1.2;
    if (item.size === 'XL') sizeMultiplier = 1.4;

    const itemPrice = basePrice * sizeMultiplier + toppingCost;
    return sum + itemPrice * item.quantity;
  }, 0);

  const discount = promoCode ? subtotal * 0.2 : 0; // 20% discount

  const deliveryFee = subtotal > 0 ? (subtotal >= 30 ? 0 : 4.0) : 0;

  const total = subtotal - discount + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        promoCode,
        applyPromoCode,
        subtotal,
        discount,
        deliveryFee,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
