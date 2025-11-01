# Next.js Routing Demo

A comprehensive tutorial project demonstrating Next.js App Router features and routing patterns.

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Overview

This project demonstrates various Next.js routing concepts:

### 1. **Basic Routing**
- **Static Routes**: `/about`, `/blog`, `/profile`
- **Home Page**: `/` - Main landing page

### 2. **Route Groups** - `(auth)`
Routes grouped for organization without affecting URL structure:
- `/login` - Login page
- `/register` - Registration page  
- `/forgot-password` - Password recovery page

### 3. **Dynamic Routes** - `[productId]`
- `/products` - Products listing
- `/products/[productId]` - Individual product pages (e.g., `/products/1`, `/products/22`)
- `/products/[productId]/reviews` - Product reviews
- `/products/[productId]/reviews/[reviewId]` - Individual review pages

### 4. **Catch-All Routes** - `[...slug]`
- `/docs/[...slug]` - Documentation with flexible nested paths (e.g., `/docs/feature/api/reference`)

### 5. **Nested Layouts**
- **Root Layout** (`app/layout.tsx`) - Global navigation and footer
- **Products Layout** (`app/products/layout.tsx`) - Shared layout for all product pages

### 6. **Private Routes** - `_lib`
- Files/folders prefixed with `_` are private and not accessible via URL
- Example: `/_lib` returns 404

### 7. **Special Files**
- **Custom 404 Pages**: `not-found.tsx` for custom error handling
- **Metadata**: SEO-friendly page titles and descriptions

### 8. **URL Encoding**
- `%5Funderscore-route` - Demonstrates URL-encoded route handling

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Typed Routes** - Type-safe navigation

## Key Features Demonstrated

- File-based routing system
- Nested layouts and route groups
- Dynamic and catch-all segments
- Custom 404 pages
- Client-side navigation with `<Link>`
- TypeScript integration with typed routes
- Tailwind CSS styling

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing) - Deep dive into routing
- [App Router](https://nextjs.org/docs/app) - Understanding the App Router architecture
