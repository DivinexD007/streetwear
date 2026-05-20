'use client';

import { Search } from 'lucide-react';
import { CATEGORIES } from '@/data/products';

export default function ShopFilters({ category, onCategory, query, onQuery, count }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
        marginBottom: '4vw',
        paddingBottom: 20,
        borderBottom: '1px solid rgba(242,237,228,0.08)',
      }}
    >
      {/* Categories */}
      <ul
        style={{
          display: 'flex',
          gap: 8,
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flexWrap: 'wrap',
        }}
      >
        {CATEGORIES.map((c) => {
          const active = c.id === category;
          return (
            <li key={c.id}>
              <button
                onClick={() => onCategory(c.id)}
                style={{
                  background: active ? 'var(--color-white)' : 'transparent',
                  color: active ? 'var(--color-black)' : 'rgba(242,237,228,0.55)',
                  border: '1px solid rgba(242,237,228,0.12)',
                  padding: '10px 18px',
                  fontFamily: 'var(--font-barlow)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Search + count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <span
          style={{
            fontFamily: 'var(--font-barlow)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: 'rgba(242,237,228,0.35)',
            textTransform: 'uppercase',
          }}
        >
          {count} {count === 1 ? 'piece' : 'pieces'}
        </span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid rgba(242,237,228,0.12)',
            padding: '8px 14px',
            minWidth: 220,
          }}
        >
          <Search size={14} strokeWidth={1.5} color="rgba(242,237,228,0.35)" />
          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-barlow)',
              fontSize: 13,
              letterSpacing: '0.05em',
            }}
          />
        </div>
      </div>
    </div>
  );
}
