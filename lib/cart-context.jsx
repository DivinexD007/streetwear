'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'vt_cart_v1';

/**
 * Cart line items are keyed by `${productId}-${size}` so the same product in
 * different sizes are treated as separate lines.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* Hydrate from localStorage once on mount */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      /* corrupted storage — ignore */
    }
    setHydrated(true);
  }, []);

  /* Persist on every change after hydration */
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota exceeded — ignore */
    }
  }, [items, hydrated]);

  const addItem = useCallback((product, size, quantity = 1) => {
    const key = `${product.id}-${size}`;
    setItems((prev) => {
      const existing = prev.find((it) => it.key === key);
      if (existing) {
        return prev.map((it) =>
          it.key === key ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          currency: product.currency,
          size,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  }, []);

  const updateQuantity = useCallback(
    (key, quantity) => {
      if (quantity < 1) return removeItem(key);
      setItems((prev) =>
        prev.map((it) => (it.key === key ? { ...it, quantity } : it))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotal, itemCount } = useMemo(
    () => ({
      subtotal: items.reduce((s, it) => s + it.price * it.quantity, 0),
      itemCount: items.reduce((s, it) => s + it.quantity, 0),
    }),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((v) => !v),
      hydrated,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, isOpen, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
