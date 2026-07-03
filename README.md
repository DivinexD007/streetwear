<h1 align="center">Streetwear</h1>

<p align="center">
  Production-style streetwear e-commerce frontend
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock&logoColor=black" />
  <img src="https://img.shields.io/badge/Stripe-purple?style=flat-square&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

---

## Overview

A production-style e-commerce frontend for a streetwear brand. Features GSAP-driven scroll animations, dynamic product pages with advanced filtering, persistent cart state, and Stripe checkout.

## Features

**Storefront**
- Animated hero with GSAP scroll-triggered sequences
- Product grid with category filtering and dynamic routing
- Product detail pages with image galleries and size selection
- Poster scroll section and brand storytelling animations

**Cart & Checkout**
- Persistent cart via React Context API — survives page navigation
- Cart drawer with real-time quantity management
- Stripe integration for secure payment processing
- Checkout API route handling order creation

**UI & Performance**
- Custom animated cursor
- Smooth page loader
-  for automatic image optimization
- Framer Motion for micro-interactions
- Lazy loading and component memoization

---

## Stack

| | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (JSX) |
| Animations | GSAP 3, Framer Motion |
| Styling | Tailwind CSS |
| Payments | Stripe |
| Deployment | Vercel |

---

## Quick Start

```bash
git clone https://github.com/DivinexD007/streetwear.git
cd streetwear
npm install

cp .env.example .env.local
# Add your Stripe keys

npm run dev
```

Open http://localhost:3000

---

## Environment Variables

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Project Structure

```
streetwear/
├── app/
│   ├── api/checkout/       # Stripe checkout session API route
│   ├── shop/               # Product listing and detail pages
│   ├── checkout/           # Checkout flow
│   └── page.jsx            # Homepage
├── components/
│   ├── Hero.jsx            # GSAP animated hero
│   ├── ProductGrid.jsx     # Filtered product listing
│   ├── CartDrawer.jsx      # Slide-out cart
│   ├── Navbar.jsx
│   ├── Cursor.jsx          # Custom cursor
│   ├── Loader.jsx          # Page loader
│   └── PosterScroll.jsx    # Scroll-triggered poster section
├── lib/                    # Cart context, Stripe helpers
├── data/                   # Product data
└── public/                 # Static assets
```

---

## Deployment

Deployed on Vercel. Set environment variables in the Vercel dashboard and connect the GitHub repo — auto-deploys on push to `main`.

---

## License

MIT
