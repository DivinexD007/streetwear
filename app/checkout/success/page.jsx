'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Cursor from '@/components/Cursor';
import Navbar from '@/components/Navbar';

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const wrapRef = useRef(null);

  /* Clear cart once on landing */
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  /* Entrance */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Cursor />
      <Navbar />
      <main
        style={{
          background: '#0A0A0A',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          ref={wrapRef}
          style={{
            textAlign: 'center',
            maxWidth: 560,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 22,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(217,31,31,0.12)',
              border: '1px solid var(--color-red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-red)',
            }}
          >
            <Check size={28} strokeWidth={2} />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.35em',
              color: 'var(--color-red)',
              textTransform: 'uppercase',
            }}
          >
            Order Confirmed
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              fontSize: 'clamp(48px, 7vw, 96px)',
              lineHeight: 0.9,
              color: 'var(--color-white)',
            }}
          >
            THANK YOU
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(242,237,228,0.6)',
              maxWidth: 440,
            }}
          >
            Your piece has been reserved. A receipt and tracking details are on
            their way to your inbox. Drop 01 ships in 7–10 business days.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Link
              href="/shop"
              style={{
                padding: '14px 28px',
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
              Continue Shopping
            </Link>
            <Link
              href="/"
              style={{
                padding: '14px 28px',
                background: 'transparent',
                border: '1px solid rgba(242,237,228,0.15)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-barlow)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              Back to Site
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
