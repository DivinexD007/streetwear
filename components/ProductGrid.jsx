'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProductBySlug } from '@/data/products';
import { formatPrice } from '@/lib/format';
import AddToCartButton from './AddToCartButton';

gsap.registerPlugin(ScrollTrigger);

/* Featured product on the landing page */
const FEATURED_SLUG = 'sweet-dreams';

export default function ProductGrid() {
  const product = getProductBySlug(FEATURED_SLUG);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const hoverLayerRef = useRef(null);
  const infoRef = useRef(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
          delay: 0.2,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onEnter = () => {
    gsap.to(hoverLayerRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.45, ease: 'power2.out' });
  };

  const onLeave = () => {
    gsap.to(hoverLayerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(cardRef.current, { scale: 1, duration: 0.35, ease: 'power2.out' });
  };

  if (!product) return null;

  return (
    <section
      ref={sectionRef}
      id="drop"
      style={{ background: '#0A0A0A', padding: '8vw' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '5vw',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 'clamp(28px, 4vw, 56px)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
          }}
        >
          THE DROP
        </h2>
        <Link
          href="/shop"
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(242,237,228,0.55)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-red)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(242,237,228,0.55)')}
        >
          View All →
        </Link>
      </div>

      {/* Featured layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4vw',
          alignItems: 'center',
        }}
      >
        {/* Card */}
        <Link
          href={`/shop/${product.slug}`}
          data-cursor="view"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          style={{ display: 'block', textDecoration: 'none' }}
        >
          <article
            ref={cardRef}
            style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              background: '#111',
              willChange: 'transform',
            }}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />

            <div ref={hoverLayerRef} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
              <Image
                src={product.images[1] || product.images[0]}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                aria-hidden="true"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>

            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                fontFamily: 'var(--font-barlow)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--color-red)',
                background: 'rgba(10,10,10,0.6)',
                padding: '6px 12px',
              }}
            >
              LIMITED — 999 PIECES
            </div>
          </article>
        </Link>

        {/* Info */}
        <div ref={infoRef}>
          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-red)',
              marginBottom: 16,
            }}
          >
            DROP 01
          </p>

          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 88px)',
              lineHeight: 0.9,
              color: 'var(--color-white)',
              marginBottom: 16,
            }}
          >
            SWEET
            <br />
            DREAMS
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontWeight: 700,
              fontSize: 26,
              color: 'var(--color-white)',
              marginBottom: 22,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatPrice(product.price, product.currency)}
          </p>

          <div
            style={{
              width: 40,
              height: 1,
              background: 'var(--color-red)',
              marginBottom: 24,
            }}
          />

          {/* Size selector */}
          <div style={{ marginBottom: 22 }}>
            <p
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'rgba(242,237,228,0.45)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Size
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {product.sizes.map((s) => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      minWidth: 48,
                      padding: '12px 14px',
                      background: active ? 'var(--color-white)' : 'transparent',
                      color: active ? 'var(--color-black)' : 'var(--color-white)',
                      border: '1px solid rgba(242,237,228,0.15)',
                      fontFamily: 'var(--font-barlow)',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spec table */}
          {[
            ['STYLE', 'Oversized Fit'],
            ['FABRIC', 'Heavy Cotton'],
            ['RUN', '999 Pieces'],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid rgba(242,237,228,0.08)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(242,237,228,0.35)',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-white)',
                }}
              >
                {value}
              </span>
            </div>
          ))}

          <div style={{ marginTop: 28 }}>
            <AddToCartButton product={product} size={size} />
          </div>
        </div>
      </div>
    </section>
  );
}
