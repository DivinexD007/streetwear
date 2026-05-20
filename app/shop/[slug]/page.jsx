'use client';

import { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { gsap } from 'gsap';
import { Minus, Plus } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { formatPrice } from '@/lib/format';
import Navbar from '@/components/Navbar';
import Cursor from '@/components/Cursor';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/shop/ProductCard';

export default function ProductPage({ params }) {
  /* Next 15+: params is a Promise. `use()` unwraps it. */
  const { slug } = use(params);
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(slug);

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  const galleryRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        galleryRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }
      );
      gsap.fromTo(
        detailsRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2,
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
          paddingTop: 100,
          paddingBottom: '8vw',
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            padding: '20px 8vw',
            fontFamily: 'var(--font-barlow)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: 'rgba(242,237,228,0.4)',
            textTransform: 'uppercase',
          }}
        >
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <span style={{ margin: '0 12px' }}>/</span>
          <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>
            Shop
          </Link>
          <span style={{ margin: '0 12px' }}>/</span>
          <span style={{ color: 'var(--color-white)' }}>{product.name}</span>
        </nav>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '4vw',
            padding: '2vw 8vw',
          }}
        >
          {/* Gallery */}
          <div ref={galleryRef}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                background: '#111',
                marginBottom: 16,
                overflow: 'hidden',
              }}
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    style={{
                      position: 'relative',
                      width: 80,
                      aspectRatio: '3/4',
                      background: '#111',
                      border:
                        activeImage === i
                          ? '1px solid var(--color-red)'
                          : '1px solid rgba(242,237,228,0.1)',
                      padding: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div
            ref={detailsRef}
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'var(--color-red)',
                textTransform: 'uppercase',
              }}
            >
              {product.tagline}
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 900,
                fontSize: 'clamp(40px, 5vw, 76px)',
                lineHeight: 0.9,
                color: 'var(--color-white)',
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 700,
                fontSize: 28,
                color: 'var(--color-white)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatPrice(product.price, product.currency)}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 14,
                lineHeight: 1.65,
                color: 'rgba(242,237,228,0.65)',
                maxWidth: 480,
              }}
            >
              {product.description}
            </p>

            {/* Size selector */}
            <div>
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
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map((s) => {
                  const active = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      style={{
                        minWidth: 56,
                        padding: '14px 18px',
                        background: active ? 'var(--color-white)' : 'transparent',
                        color: active ? 'var(--color-black)' : 'var(--color-white)',
                        border: '1px solid rgba(242,237,228,0.15)',
                        fontFamily: 'var(--font-barlow)',
                        fontSize: 12,
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

            {/* Quantity */}
            <div>
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
                Quantity
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid rgba(242,237,228,0.15)',
                }}
              >
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    width: 44,
                    textAlign: 'center',
                    fontFamily: 'var(--font-barlow)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-white)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 12 }}>
              <AddToCartButton product={product} size={size} quantity={qty} />
            </div>

            {/* Spec table */}
            <dl
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: '1px solid rgba(242,237,228,0.08)',
              }}
            >
              {[
                ['SKU', `VT-${product.id.slice(0, 6).toUpperCase()}`],
                ['CATEGORY', product.category],
                ['STOCK', product.inStock ? 'Available' : 'Coming Soon'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(242,237,228,0.06)',
                    fontFamily: 'var(--font-barlow)',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  <dt style={{ color: 'rgba(242,237,228,0.4)', fontWeight: 600 }}>{k}</dt>
                  <dd style={{ color: 'var(--color-white)', fontWeight: 600 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Related products */}
        {related.length > 0 && (
          <section style={{ padding: '8vw 8vw 0' }}>
            <h2
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--color-white)',
                textTransform: 'uppercase',
                marginBottom: '3vw',
              }}
            >
              You may also like
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '32px 24px',
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
