'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';

/**
 * Reusable Add To Cart CTA. Shows brief "ADDED" confirmation feedback,
 * pulses on click, and opens the cart drawer (handled by addItem).
 */
export default function AddToCartButton({
  product,
  size,
  quantity = 1,
  showPrice = true,
  fullWidth = true,
  disabled = false,
  label = 'ADD TO CART',
}) {
  const { addItem } = useCart();
  const btnRef = useRef(null);
  const [justAdded, setJustAdded] = useState(false);
  const isDisabled = disabled || !product.inStock || !size;

  const handleClick = () => {
    if (isDisabled) return;
    addItem(product, size, quantity);

    /* Visual feedback */
    gsap.fromTo(
      btnRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.35, ease: 'power3.out' }
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1100);
  };

  const baseLabel = !product.inStock
    ? 'SOLD OUT'
    : !size
      ? 'SELECT SIZE'
      : justAdded
        ? 'ADDED'
        : label;

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={isDisabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '18px 32px',
        background: isDisabled ? 'rgba(242,237,228,0.08)' : 'var(--color-red)',
        color: isDisabled ? 'rgba(242,237,228,0.4)' : 'var(--color-white)',
        fontFamily: 'var(--font-barlow)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        border: 'none',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) e.currentTarget.style.background = '#b01818';
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) e.currentTarget.style.background = 'var(--color-red)';
      }}
    >
      {justAdded && <Check size={14} strokeWidth={2.5} />}
      <span>{baseLabel}</span>
      {showPrice && !justAdded && product.inStock && size && (
        <span style={{ opacity: 0.65 }}>— {formatPrice(product.price * quantity)}</span>
      )}
    </button>
  );
}
