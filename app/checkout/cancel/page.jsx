'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import Cursor from '@/components/Cursor';
import Navbar from '@/components/Navbar';

export default function CheckoutCancel() {
  const wrapRef = useRef(null);

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
            maxWidth: 480,
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
              background: 'rgba(242,237,228,0.04)',
              border: '1px solid rgba(242,237,228,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(242,237,228,0.7)',
            }}
          >
            <X size={28} strokeWidth={2} />
          </div>

          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.35em',
              color: 'rgba(242,237,228,0.55)',
              textTransform: 'uppercase',
            }}
          >
            Checkout Cancelled
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 80px)',
              lineHeight: 0.9,
              color: 'var(--color-white)',
            }}
          >
            NO HARM DONE
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(242,237,228,0.55)',
            }}
          >
            Your bag is still saved. Pick up where you left off whenever you&apos;re ready.
          </p>

          <Link
            href="/shop"
            style={{
              marginTop: 8,
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
            Back to Shop
          </Link>
        </div>
      </main>
    </>
  );
}
