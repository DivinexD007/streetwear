'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  /* Open / close animation */
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (isOpen) {
      gsap.set(backdrop, { display: 'block' });
      gsap.set(panel, { display: 'flex' });
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(panel, { x: 0, duration: 0.5, ease: 'power3.out' });
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(backdrop, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => gsap.set(backdrop, { display: 'none' }),
      });
      gsap.to(panel, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => gsap.set(panel, { display: 'none' }),
      });
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* Esc to close */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err.message);
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={closeCart}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10,10,10,0.7)',
          backdropFilter: 'blur(4px)',
          opacity: 0,
          display: 'none',
          zIndex: 8999,
        }}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-label="Shopping cart"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(100vw, 460px)',
          background: '#0A0A0A',
          borderLeft: '1px solid rgba(242,237,228,0.08)',
          zIndex: 9000,
          display: 'none',
          flexDirection: 'column',
          transform: 'translateX(100%)',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 28px',
            borderBottom: '1px solid rgba(242,237,228,0.08)',
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'var(--color-red)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Your Bag
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 900,
                fontSize: 28,
                color: 'var(--color-white)',
                lineHeight: 1,
              }}
            >
              {itemCount} {itemCount === 1 ? 'PIECE' : 'PIECES'}
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              background: 'transparent',
              border: '1px solid rgba(242,237,228,0.15)',
              color: 'var(--color-white)',
              width: 38,
              height: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </header>

        {/* Items list */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px 28px',
          }}
        >
          {items.length === 0 ? (
            <EmptyState onClose={closeCart} />
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((it) => (
                <CartLine
                  key={it.key}
                  item={it}
                  onRemove={() => removeItem(it.key)}
                  onInc={() => updateQuantity(it.key, it.quantity + 1)}
                  onDec={() => updateQuantity(it.key, it.quantity - 1)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer
            style={{
              borderTop: '1px solid rgba(242,237,228,0.08)',
              padding: '24px 28px 28px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.25em',
                  color: 'rgba(242,237,228,0.45)',
                  textTransform: 'uppercase',
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontWeight: 900,
                  fontSize: 28,
                  color: 'var(--color-white)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatPrice(subtotal)}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'rgba(242,237,228,0.35)',
                textTransform: 'uppercase',
                marginBottom: 18,
              }}
            >
              Shipping calculated at checkout
            </p>

            {checkoutError && (
              <p
                role="alert"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 11,
                  color: 'var(--color-red)',
                  marginBottom: 12,
                  letterSpacing: '0.05em',
                }}
              >
                {checkoutError}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                width: '100%',
                padding: '18px',
                background: 'var(--color-red)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-barlow)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                opacity: checkoutLoading ? 0.6 : 1,
                transition: 'background 0.2s, opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!checkoutLoading) e.currentTarget.style.background = '#b01818';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--color-red)';
              }}
            >
              {checkoutLoading ? 'PROCESSING…' : 'CHECKOUT'}
              {!checkoutLoading && <ArrowRight size={14} strokeWidth={2} />}
            </button>

            <button
              onClick={clearCart}
              style={{
                width: '100%',
                marginTop: 10,
                padding: '12px',
                background: 'transparent',
                color: 'rgba(242,237,228,0.4)',
                fontFamily: 'var(--font-barlow)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                border: 'none',
              }}
            >
              Clear bag
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

function CartLine({ item, onRemove, onInc, onDec }) {
  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 1fr',
        gap: 16,
        padding: '20px 0',
        borderBottom: '1px solid rgba(242,237,228,0.06)',
      }}
    >
      <Link
        href={`/shop/${item.slug}`}
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          background: '#111',
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="88px"
          style={{ objectFit: 'cover' }}
        />
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 11,
                color: 'rgba(242,237,228,0.4)',
                letterSpacing: '0.15em',
                marginTop: 4,
              }}
            >
              SIZE {item.size}
            </p>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-white)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(242,237,228,0.12)',
            }}
          >
            <QtyBtn onClick={onDec} aria={`Decrease quantity of ${item.name}`}>
              <Minus size={12} strokeWidth={2} />
            </QtyBtn>
            <span
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 12,
                fontWeight: 600,
                width: 28,
                textAlign: 'center',
                color: 'var(--color-white)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {item.quantity}
            </span>
            <QtyBtn onClick={onInc} aria={`Increase quantity of ${item.name}`}>
              <Plus size={12} strokeWidth={2} />
            </QtyBtn>
          </div>

          <button
            onClick={onRemove}
            aria-label={`Remove ${item.name}`}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(242,237,228,0.4)',
              padding: 6,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-red)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,237,228,0.4)')}
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </li>
  );
}

function QtyBtn({ children, onClick, aria }) {
  return (
    <button
      onClick={onClick}
      aria-label={aria}
      style={{
        width: 28,
        height: 28,
        background: 'transparent',
        border: 'none',
        color: 'var(--color-white)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}

function EmptyState({ onClose }) {
  return (
    <div
      style={{
        height: '100%',
        minHeight: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 18,
        padding: '40px 20px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-playfair)',
          fontWeight: 900,
          fontSize: 36,
          color: 'var(--color-white)',
          lineHeight: 1,
        }}
      >
        EMPTY
      </p>
      <p
        style={{
          fontFamily: 'var(--font-barlow)',
          fontSize: 11,
          letterSpacing: '0.25em',
          color: 'rgba(242,237,228,0.4)',
          textTransform: 'uppercase',
        }}
      >
        Your bag is waiting
      </p>
      <Link
        href="/shop"
        onClick={onClose}
        style={{
          marginTop: 12,
          padding: '14px 32px',
          background: 'var(--color-red)',
          color: 'var(--color-white)',
          fontFamily: 'var(--font-barlow)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}
      >
        Browse the drop
      </Link>
    </div>
  );
}
