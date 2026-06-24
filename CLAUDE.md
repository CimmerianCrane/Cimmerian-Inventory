# CLAUDE.md — Inventory Web App

## Project Overview
- **Type:** Inventory management web application
- **Stack:** `index.html` + Tailwind CSS via CDN. Split into multiple files when architecture demands it.
- **Goal:** Track products, stock levels, orders, and suppliers with a clean, professional UI

## Session Protocol
1. Invoke `frontend-design` skill before writing any frontend code — every session, no exceptions.
2. Check `brand_assets/` for logos, color palettes, style guides, or reference images. Use real assets wherever they exist.
3. **The Vite dev server is already running on `http://localhost:5173` — NEVER start a new one.** If port 5173 is in use, that means the user already has it running. Do not start servers on alternate ports (5174, 5175, etc.). Just edit code; the running dev server will hot-reload automatically.
4. Screenshot: `node screenshot.mjs http://localhost:5173` → `./temporary screenshots/screenshot-N.png` (auto-increments, never overwritten). Read the PNG directly with Read tool. Be specific in comparisons — exact pixel values, hex colors, font weights. Minimum 2 comparison rounds before done.

## Design Standards
- **Colors:** Custom brand palette only. Never use default Tailwind palette (indigo-500, blue-600, etc.).
- **Shadows:** Layered, color-tinted with low opacity — never flat `shadow-md`.
- **Typography:** Display/serif for headings, clean sans-serif for body. Tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body text.
- **Gradients:** Layer multiple radial gradients. Add SVG noise/grain texture for depth and richness.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive States:** Every clickable element must have hover, focus-visible, and active states. No exceptions.
- **Images:** Gradient overlay (`bg-gradient-to-t from-black/60`) plus color treatment layer with `mix-blend-multiply`.
- **Spacing:** Consistent spacing tokens — not random Tailwind utility steps.
- **Depth:** Layered surfaces (base → elevated → floating) via z-index hierarchy and shadow intensity.

## Inventory UI Patterns
- **Tables:** Sticky headers, alternating row backgrounds, row hover highlight, sortable column headers, bulk selection with checkboxes, pagination or virtual scrolling for large datasets.
- **Forms:** Inline validation with clear error states, labels positioned above inputs, related fields grouped with subtle dividers, primary/secondary button hierarchy.
- **Search & Filter:** Prominent search bar with filter chips or dropdowns, "clear all filters" button, live results count, no-results state with suggestions.
- **Dashboard Widgets:** Metric cards showing icon, current value, and trend indicator (up/down arrow with percentage). Use sparklines where data history is relevant.
- **Modals/Dialogs:** Confirmation dialog for destructive actions showing the item name. Escape key and outside-click to dismiss. Focus trap inside modal.
- **Empty States:** Illustrated placeholder with descriptive text and a call-to-action button — never a blank screen.
- **Loading States:** Skeleton loaders that match the content shape. Avoid generic spinners.

## Architecture Guidelines
- **Stay single-file** when: <5 distinct sections, <3 data entities, no complex routing.
- **Split into files** when: >3 data entities, reusable components across views, or state management outgrows a single object. Split into `index.html`, `styles.css`, `app.js`, plus domain modules.
- **Data Model** (adjust as requirements emerge): Products (id, name, sku, category, price, cost, quantity, reorderLevel, imageUrl, supplierId), Categories (id, name), Suppliers (id, name, contact, leadTime), Orders (id, productId, type in/out, quantity, date, notes).
- **State Management:** Single state object as source of truth. Derive computed values (totals, filtered lists) — never store them separately. Persist user-facing data to localStorage. Use event-driven updates when multiple UI sections depend on the same data.

## Responsive Breakpoints
- **Mobile (0–640px):** Single column, stacked layouts, hamburger nav, collapsible filters
- **Tablet (641–1024px):** Side-by-side panels where logical, condensed tables
- **Desktop (1025px+):** Full layout with sidebar, multi-column tables, persistent filters

## Hard Rules
- Match reference designs exactly — never "improve" them
- No `transition-all`, no default Tailwind blue/indigo as primary
- No mobile responsiveness shortcuts — test all breakpoints
- No committing or declaring done until user confirms
- Do not add sections, features, or content not in the reference
