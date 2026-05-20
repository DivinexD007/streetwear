'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const hoverRef = useRef(null);
  const hasHover = product.images.length > 1;

  const onEnter = () => {
    if (hasHover) gsap.to(hoverRef.current, { opacity: 1, duration: 0.45, ease: 'power2.out' });
    gsap.to(cardRef.current, { scale: 1.015, duration: 0.4, ease: 'power2.out' });
  };
  const onLeave = () => {
    if (hasHover) gsap.to(hoverRef.current, { opacity: 0, duration: 0.35, ease: 'power2.out' });
    gsap.to(cardRef.current, { scale: 1, duration: 0.35, ease: 'power2.out' });
  };

  return (
    <Link
      href={`/shop/${product.slug}`}
      data-cursor="view"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article
        ref={cardRef}
        className="product-card"
        style={{
          position: 'relative',
          aspectRatio: '3/4',
          overflow: 'hidden',
          background: '#111',
          willChange: 'transform',
          marginBottom: 16,
        }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />

        {hasHover && (
          <div ref={hoverRef} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              aria-hidden="true"
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
          </div>
        )}

        {/* Status tag */}
        {!product.inStock && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: 'rgba(10,10,10,0.75)',
              padding: '6px 10px',
              fontFamily: 'var(--font-barlow)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'rgba(242,237,228,0.7)',
              textTransform: 'uppercase',
            }}
          >
            Coming Soon
          </div>
        )}
        {product.inStock && product.featured && (
          <div
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              background: 'var(--color-red)',
              padding: '6px 10px',
              fontFamily: 'var(--font-barlow)',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'var(--color-white)',
              textTransform: 'uppercase',
            }}
          >
            Limited
          </div>
        )}
      </article>

      {/* Card meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--color-white)',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-barlow)',
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: '0.15em',
              color: 'rgba(242,237,228,0.4)',
              textTransform: 'uppercase',
              marginTop: 4,
            }}
          >
            {product.tagline}
          </p>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-white)',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
          }}
        >
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}
