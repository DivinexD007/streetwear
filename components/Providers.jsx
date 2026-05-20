'use client';

import { CartProvider } from '@/lib/cart-context';
import CartDrawer from './CartDrawer';

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
