import { Stack } from "expo-router";
import "../global.css";
import { ThemeProvider } from "../providers/ThemeProvider";
import { AuthProvider } from "../providers/AuthProvider";
import { OrderProvider } from "../providers/OrderProvider";
import { CartProvider } from "../providers/CartProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="[id]" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="cart" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="checkout-success" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
