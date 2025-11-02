---
title: Next.js 15 Fundamentals Summary
description: Core concepts of the App Router, Routing, Layouts, and Metadata.
---

# 🚀 Next.js 15 Fundamentals: App Router Summary

This document outlines the foundational concepts of modern Next.js development using the App Router.

---

## 1. 🏗️ Project Structure & Conventions

Next.js uses a **file-system-based router** inside the mandatory `app` directory.

### Key Concepts

- **App Directory (`app`)**: All routes and shared UI must reside here. The directory structure directly maps to URL paths.
- **Special Files**: These reserved filenames define UI and behavior for a route segment:
  - `page.js`: Defines the primary UI for a unique route.
  - `layout.js`: Defines shared UI that wraps child routes.
  - `not-found.js`: Defines a custom 404 error page.

---

## 2. 🧭 Routing & Navigation

Routing governs how paths map to code using specific directory naming conventions.

| Routing Type  | Syntax/Convention    | Purpose                                                                              | Example URL                             |
| :------------ | :------------------- | :----------------------------------------------------------------------------------- | :-------------------------------------- |
| **Basic**     | `folderName/page.js` | Defines a single route segment.                                                      | `/products`                             |
| **Nested**    | Nested folders       | Creates hierarchical URL paths.                                                      | `/dashboard/settings`                   |
| **Dynamic**   | `[paramName]`        | Captures a variable part of the URL (accessible via `params`).                       | `/users/42`                             |
| **Catch-All** | `[...paramName]`     | Captures all subsequent path segments as an array.                                   | `/docs/a/b/c`                           |
| **Group**     | `(folderName)`       | **Organizes files without affecting the URL**. Great for multiple top-level layouts. | `/login` (folder is `app/(auth)/login`) |
| **Private**   | `_folderName`        | Excludes a directory from routing. Used for local components or utility files.       | _(Not accessible)_                      |

---

### 🧰 Programmatic Navigation with `useRouter()`

For navigation triggered by user actions (like button clicks) or application logic, use the **`useRouter()`** hook from `next/navigation`.

⚠️ **Important**: `useRouter()` is a **Client Component hook**, so you must use `"use client";` directive.

#### Basic Setup

**Example: `app/order-product/page.tsx`**

```tsx
"use client";
import { useRouter } from "next/navigation";

export default function OrderProductPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Order Product Page</h1>
      <button onClick={() => router.push("/")}>Order Now</button>
    </div>
  );
}
```

---

### 🔧 `useRouter()` Methods

The `useRouter()` hook provides several methods for navigation and route manipulation:

| Method           | Syntax                     | Description                                          | History Effect                               |
| :--------------- | :------------------------- | :--------------------------------------------------- | :------------------------------------------- |
| **`push()`**     | `router.push('/path')`     | Navigate to a new route.                             | **Adds** a new entry to history stack.       |
| **`replace()`**  | `router.replace('/path')`  | Navigate to a new route without adding to history.   | **Replaces** current entry in history stack. |
| **`back()`**     | `router.back()`            | Navigate to the previous page in history.            | Goes back one entry.                         |
| **`forward()`**  | `router.forward()`         | Navigate to the next page in history (if available). | Goes forward one entry.                      |
| **`refresh()`**  | `router.refresh()`         | Refresh the current route (re-fetch data).           | No history change.                           |
| **`prefetch()`** | `router.prefetch('/path')` | Prefetch a route for faster navigation.              | No navigation occurs.                        |

---

### 📋 Detailed Method Examples

#### 1. **`router.push(path)`** - Standard Navigation

Adds a new entry to the browser history. Users can press "Back" to return.

```tsx
// Navigate to home page
router.push("/");

// Navigate with query parameters
router.push("/articles/123?lang=en");

// Navigate to dynamic route
router.push(`/products/${productId}`);
```

**Use Cases:**

- Standard page navigation
- Moving between app sections
- Any navigation where users should be able to go back

---

#### 2. **`router.replace(path)`** - Replace Navigation

Replaces the current history entry. Users **cannot** press "Back" to return to the previous page.

```tsx
// Redirect after login (prevent going back to login page)
router.replace("/dashboard");

// Redirect after form submission
router.replace("/confirmation");

// Redirect unauthorized users
if (!isAuthenticated) {
  router.replace("/login");
}
```

**Use Cases:**

- Login/logout redirects
- Form submission confirmations
- Authorization redirects
- Any scenario where the previous page shouldn't be accessible via "Back"

---

#### 3. **`router.back()`** - Navigate Backwards

Equivalent to clicking the browser's back button.

```tsx
<button onClick={() => router.back()}>Go Back</button>
```

**Use Cases:**

- Custom back buttons
- Cancel operations
- Return to previous page

---

#### 4. **`router.forward()`** - Navigate Forwards

Equivalent to clicking the browser's forward button (only works if there's a forward entry).

```tsx
<button onClick={() => router.forward()}>Go Forward</button>
```

**Use Cases:**

- Custom navigation controls
- Redo navigation after going back

---

#### 5. **`router.refresh()`** - Refresh Current Route

Re-fetches data for the current route without a full page reload. Useful for Server Components.

```tsx
// Refresh data after mutation
const handleUpdate = async () => {
  await updateData();
  router.refresh(); // Re-fetch server component data
};
```

**Use Cases:**

- Refresh data after mutations
- Update Server Component data
- Sync UI with server state

---

#### 6. **`router.prefetch(path)`** - Prefetch Routes

Prefetch a route in the background for faster navigation. Next.js automatically prefetches visible `<Link>` components, but you can manually prefetch routes.

```tsx
// Prefetch on hover
<button
  onMouseEnter={() => router.prefetch("/dashboard")}
  onClick={() => router.push("/dashboard")}
>
  Go to Dashboard
</button>
```

**Use Cases:**

- Optimize navigation performance
- Prefetch routes based on user behavior
- Improve perceived performance

---

### 🎯 `push()` vs `replace()` - Quick Decision Guide

| Scenario                     | Method      | Reason                                  |
| :--------------------------- | :---------- | :-------------------------------------- |
| Normal page navigation       | `push()`    | User should be able to go back          |
| After login/logout           | `replace()` | Prevent returning to auth pages         |
| After form submission        | `replace()` | Prevent duplicate submissions           |
| Unauthorized access redirect | `replace()` | Prevent returning to protected pages    |
| Multi-step wizard completion | `replace()` | Prevent returning to intermediate steps |
| Product added to cart        | `push()`    | User might want to go back              |
| Cancel/Back button           | `back()`    | Return to previous page                 |

---

### 🔗 Active Link Styling with `usePathname`

To determine if a link is the currently active route and apply styling (e.g., highlighting), you must use the **`usePathname()`** hook.

- **Rule**: `usePathname` is a **Client Component hook**, meaning the component where you use it must be marked with `"use client";`.
- **Purpose**: It returns the **current URL pathname** (e.g., `/dashboard/settings`).

**Example Code Context:**

````javascript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  // Check if the current URL matches the link's href
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={isActive ? 'text-blue-500 font-bold' : 'text-gray-500'}
    >
      {children}
    </Link>
  );
}

---

## 3. 📦 Working with `params` and `searchParams`

Next.js provides two key props to access dynamic route data and query strings: `params` and `searchParams`.

### A. Understanding `params` vs `searchParams`

| Prop | Purpose | Example URL | Accessible Value |
| :--- | :--- | :--- | :--- |
| **`params`** | Captures **dynamic route segments** from the URL path. | `/articles/123` | `{ articleId: "123" }` |
| **`searchParams`** | Captures **query string parameters** from the URL. | `/articles/123?lang=en` | `{ lang: "en" }` |

### B. Server Components (Async/Await Pattern)

In **Server Components** (`page.js`), both `params` and `searchParams` are **Promises** in Next.js 15+ and must be awaited.

**Example: `app/articles/[articleId]/page.tsx`**

```tsx
import Link from "next/link";

export default async function ArticlePage({
  params,
  searchParams
}: {
  params: { articleId: string },
  searchParams: { lang: "en" | "es" | "fr" }
}) {
  const { articleId } = await params;
  const { lang } = await searchParams;

  return (
    <div>
      <p>Article Id: {articleId}</p>
      <p>Read Article language: {lang}</p>
      <Link href={`/articles/${articleId}?lang=en`}>Read Article En</Link>
      <Link href={`/articles/${articleId}?lang=es`}>Read Article Es</Link>
      <Link href={`/articles/${articleId}?lang=fr`}>Read Article Fr</Link>
    </div>
  );
}
````

### C. Client Components (React `use()` Hook)

In **Client Components**, you must use React's `use()` hook to unwrap the Promises.

**Example: Client Component Version**

```tsx
"use client";
import Link from "next/link";
import { use } from "react";

export default function ArticlePage({
  params: Params,
  searchParams,
}: {
  params: Promise<{ articleId: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { articleId } = use(Params);
  const { lang } = use(searchParams);

  return (
    <div>
      <p>Article Id: {articleId}</p>
      <p>Read Article language: {lang}</p>
      <Link href={`/articles/${articleId}?lang=en`}>Read Article En</Link>
      <Link href={`/articles/${articleId}?lang=es`}>Read Article Es</Link>
      <Link href={`/articles/${articleId}?lang=fr`}>Read Article Fr</Link>
    </div>
  );
}
```

### D. Important: `searchParams` in Layouts

⚠️ **`searchParams` is NOT available in `layout.js` files** because layouts persist across navigation and don't re-render when query parameters change.

**Server Layout - Only `params` Available:**

```tsx
export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { articleId: string };
}) {
  const { articleId } = await params;

  return (
    <div>
      <h1>Article Layout</h1>
      <p>Current Article Id: {articleId}</p>
      {children}
    </div>
  );
}
```

**Client Layout - Access Search Params with Hooks:**

If you need search params in a layout, convert it to a Client Component and use hooks:

```tsx
"use client";
import { useParams, useSearchParams } from "next/navigation";

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const articleId = params.articleId;
  const lang = searchParams.get("lang") || "en";

  return (
    <div>
      <h1>Article Layout</h1>
      <p>Current Article Id: {articleId}</p>
      <p>Current Language: {lang}</p>
      {children}
    </div>
  );
}
```

### E. Key Takeaways

| Context                     | `params` Access    | `searchParams` Access    |
| :-------------------------- | :----------------- | :----------------------- |
| **Server Component (Page)** | `await params`     | `await searchParams`     |
| **Client Component (Page)** | `use(params)`      | `use(searchParams)`      |
| **Server Layout**           | `await params`     | ❌ Not available         |
| **Client Layout**           | `useParams()` hook | `useSearchParams()` hook |

---

## 4. 🎨 Layouts, UI, and Metadata

Layouts and metadata are essential for consistent UI and SEO.

### A. Layout Management

| Layout Type          | Definition                      | Usage                                                                                    |
| :------------------- | :------------------------------ | :--------------------------------------------------------------------------------------- |
| **Root Layout**      | `app/layout.js`                 | **Mandatory**. Wraps the entire application, defining `<html>` and `<body>` tags.        |
| **Scoped Layout**    | `layout.js` in a subdirectory   | Wraps all pages and nested layouts within that directory.                                |
| **Multiple Layouts** | Achieved with **Group Routing** | Allows distinct top-level layouts (e.g., public vs. admin) while maintaining clean URLs. |

### B. Not Found Handling

- **Global Not Found**: Defined by `app/not-found.js`.
- **Local Not Found**: Defined by a local `not-found.js` file. To trigger it manually from code (e.g., if a database item is missing), you must call the **`notFound()` function**.

### C. Metadata (SEO)

Metadata must always be defined in **Server Components** (`page.js` or `layout.js`).

| Metadata Goal       | Configuration Method                                         | Key Detail                                                                                   |
| :------------------ | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Global Defaults** | Exported `metadata` object in `app/layout.js`.               | Use `title: { default: '...', template: '...' }` to create a consistent title structure.     |
| **Local Overrides** | Exported `metadata` object in a specific `page.js`.          | Use `title: { absolute: '...' }` to ignore the global template for that page.                |
| **Dynamic Content** | Export an **`async function generateMetadata({ params })`**. | Allows you to fetch data based on route parameters and generate dynamic titles/descriptions. |
