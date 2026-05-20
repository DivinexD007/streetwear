'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRODUCTS } from '@/data/products';
import Navbar from '@/components/Navbar';
import Cursor from '@/components/Cursor';
import ProductCard from '@/components/shop/ProductCard';
import ShopFilters from '@/components/shop/ShopFilters';

gsap.registerPlugin(ScrollTrigger);

export default function ShopPage() {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const gridRef = useRef(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [category, query]);

  /* Stagger reveal whenever the filtered set changes */
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('a');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
    );
  }, [filtered]);

  return (
    <>
      <Cursor />
      <Navbar />
      <main style={{ background: '#0A0A0A', minHeight: '100dvh', paddingTop: 100 }}>
        <section style={{ padding: '4vw 8vw 8vw' }}>
          {/* Page header */}
          <header
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: '4vw',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-barlow)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.35em',
                color: 'var(--color-red)',
                textTransform: 'uppercase',
              }}
            >
              The Shop
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 900,
                fontSize: 'clamp(48px, 8vw, 128px)',
                lineHeight: 0.9,
                color: 'var(--color-white)',
              }}
            >
              EVERY PIECE
              <br />
              <span style={{ color: 'var(--color-red)', fontStyle: 'italic' }}>
                A LIMITED RUN
              </span>
            </h1>
          </header>

          {/* Filters */}
          <ShopFilters
            category={category}
            onCategory={setCategory}
            query={query}
            onQuery={setQuery}
            count={filtered.length}
          />

          {/* Grid */}
          {filtered.length > 0 ? (
            <div
              ref={gridRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '32px 24px',
              }}
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '80px 0',
                textAlign: 'center',
                color: 'rgba(242,237,228,0.4)',
                fontFamily: 'var(--font-barlow)',
                fontSize: 14,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              No pieces match — try clearing filters
            </div>
          )}
        </section>
      </main>
    </>
  );
}
