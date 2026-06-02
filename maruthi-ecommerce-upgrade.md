# MARUTHI COLLECTIONS — B2C E-Commerce Upgrade Roadmap

> Roadmap for upgrading the editorial scroll site into a full B2C saree
> e-commerce platform, while preserving the heritage/cinematic feel.

## Priority phases
1. **FIX** — routing / scroll-trigger conflicts on route changes
2. **EXPAND** — dedicated `/sarees` catalog (categories, filters, sort, detail)
3. **CONVERT** — wishlist, cart, checkout, payment (Razorpay)

---

## PHASE 1 — Routing & scroll fixes
- Reset scroll + recalc/kill stale ScrollTriggers on every route change.
- Wire all routes in the router; use `<Link>`/`<NavLink>` (no bare `#` anchors).
- Ensure HeroCanvas + CollectionStack kill their own ScrollTriggers on unmount.
- New routes: `/`, `/sarees`, `/sarees/:category`, `/saree/:id`, `/wishlist`,
  `/cart`, `/checkout`, `/order-confirmation/:orderId`, `/account`, `/story`,
  `/visit`, `*` (404).

## PHASE 2 — Sarees catalog
- Categories: all, kanjivaram, banarasi, pochampally, gadwal, uppada,
  venkatagiri, cotton, daily-wear, budget-friendly, bridal, festive.
- `src/data/sarees.js` — product schema: id, sku, title, weave, region, fabric,
  occasion[], color, colorHex, price, mrp, discount, images[], description,
  fullDescription, specifications{}, stock, isUnique, tags[], rating,
  reviewCount, badge, featured. Plus `filterSarees()` helper.
- `SareeCard.jsx` — image (hover swap), badge, "One of One", wishlist toggle,
  quick add to cart, price + MRP strike + % off.
- `Sarees.jsx` — breadcrumb, category pills, filter sidebar (price/weave/fabric/
  occasion/color/region via `useSearchParams`), sort dropdown, product grid,
  load-more/pagination.
- `SareeDetail.jsx` — thumbnail+main gallery w/ zoom, price block, color,
  availability, add-to-cart / buy-now / wishlist, trust badges, description,
  spec table, curator WhatsApp, "You may also like", reviews.

## PHASE 3 — E-commerce
- Context providers: `CartContext`, `WishlistContext`, `ToastContext`
  (localStorage persistence at `maruthi-cart` / `maruthi-wishlist`).
- `Cart.jsx` — line items, qty +/−, remove (undo), coupon, sticky order summary
  (subtotal, shipping, 5% GST, total), empty state, recently viewed.
- `Wishlist.jsx` — grid, move-to-cart, remove, move-all, empty state.
- `Checkout.jsx` — 4 steps (Address → Shipping → Payment → Review) with
  react-hook-form + zod; PIN→city/state autofill (api.postalpincode.in).
- Payment — Razorpay checkout + Netlify function `create-razorpay-order.js`
  (server-side order creation); COD / bank transfer / WhatsApp options.
- `OrderConfirmation.jsx` — order id, summary, address, curator WhatsApp.
- `Account.jsx` — OTP login, orders, addresses, profile (Phase 4).

## Design extensions
- New tokens: success (peacock-teal), warning (zari-gold), error (maroon-silk),
  price (maroon), price-strike (ink-soft), discount (peacock-teal).
- Toasts (bottom-right, maroon), loading skeletons (no spinners), modals,
  Indian price formatting `toLocaleString('en-IN')`, trust-badge row.

## Editorial voice (keep curator tone)
- "Add to Cart" / "Order This Saree" (not "Buy Now!!!")
- "Found a Home" / "Currently with another bride" (not "Sold Out")
- "Speak to Sai Priyanka" (not "Customer Support")
- "7-Day Promise", "Sent from Nidadavole", "Questions Sai Priyanka often hears"

## Packages
react-router-dom, lenis, framer-motion, react-hot-toast, react-hook-form, zod,
@hookform/resolvers, lucide-react. Backend: razorpay.

## Env vars
`VITE_RAZORPAY_KEY_ID`, `VITE_WHATSAPP_NUMBER=918639232932`, owner/location/pin.
Netlify (server): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `INTERAKT_API_KEY`.

## Don't break what exists
- Keep the frame-sequence hero, ivory/maroon/zari-gold palette, and
  Cormorant + Cinzel + Lato type.
- No hard-sell language, popups, exit-intent, email-capture, chatbots.
- It should still feel like a quiet boutique — even at checkout.

---
_See the original brief for full code samples, ASCII layouts, and acceptance
criteria. This file is the condensed working roadmap._
