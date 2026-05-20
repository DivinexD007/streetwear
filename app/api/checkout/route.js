import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/data/products';

/**
 * POST /api/checkout
 *
 * Body: { items: CartLine[] }
 * Re-validates each line against the server-side catalog so a tampered
 * client price can't be charged. Returns { url } pointing at Stripe Checkout.
 */
export async function POST(request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const items = Array.isArray(body?.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  /* Build line items from server-side product data — never trust client price */
  const lineItems = [];
  for (const cartItem of items) {
    const product = getProductById(cartItem.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${cartItem.productId}` },
        { status: 400 }
      );
    }
    if (!product.inStock) {
      return NextResponse.json(
        { error: `${product.name} is not available for purchase` },
        { status: 400 }
      );
    }
    if (!product.sizes.includes(cartItem.size)) {
      return NextResponse.json(
        { error: `Invalid size for ${product.name}` },
        { status: 400 }
      );
    }
    const quantity = Math.max(1, Math.min(99, Number(cartItem.quantity) || 1));

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get('origin') ||
      `https://${request.headers.get('host')}`;

    lineItems.push({
      price_data: {
        currency: product.currency.toLowerCase(),
        product_data: {
          name: `${product.name} — ${cartItem.size}`,
          description: product.tagline,
          images: product.images.slice(0, 1).map((img) =>
            img.startsWith('http') ? img : `${origin}${img}`
          ),
          metadata: {
            product_id: product.id,
            size: cartItem.size,
          },
        },
        unit_amount: product.price,
      },
      quantity,
    });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    request.headers.get('origin') ||
    `https://${request.headers.get('host')}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['IE', 'DE', 'FR', 'NL', 'ES', 'IT', 'BE', 'AT', 'PT', 'GB', 'US', 'IN'],
      },
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { error: err.message || 'Stripe session failed' },
      { status: 500 }
    );
  }
}
