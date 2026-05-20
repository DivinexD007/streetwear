'use client';

import { useEffect, useRef } from 'react';
import { ShoppingBag } from 'lucide-react';
import { gsap } from 'gsap';
import { useCart } from '@/lib/cart-context';

export default function CartButton() {
  const { itemCount, openCart, hydrated } = useCart();
  const badgeRef = useRef(null);
  const prevCount = useRef(itemCount);

  /* Pulse the badge when count changes */
  useEffect(() => {
    if (!hydrated) return;
    if (itemCount === prevCount.current) return;
    prevCount.current = itemCount;
    if (!badgeRef.current || itemCount === 0) return;
    gsap.fromTo(
      badgeRef.current,
      { scale: 1.5 },
      { scale: 1, duration: 0.4, ease: 'back.out(2)' }
    );
  }, [itemCount, hydrated]);

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart, ${itemCount} items`}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-barlow)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      <ShoppingBag size={16} strokeWidth={1.5} />
      <span>BAG</span>
      {hydrated && itemCount > 0 && (
        <span
          ref={badgeRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -8,
            right: -10,
            minWidth: 18,
            height: 18,
            padding: '0 5px',
            background: 'var(--color-red)',
            color: 'var(--color-white)',
            fontFamily: 'var(--font-barlow)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0,
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mixBlendMode: 'normal',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
