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
  - `template.js`: Similar to layout but re-renders on navigation.
  - `loading.js`: Defines loading UI shown while page content loads.
  - `error.js`: Defines error UI for handling errors in a route segment.
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

| Layout Type | Definition | Usage |
| :--- | :--- | :--- |
| **Root Layout** | `app/layout.js` | **Mandatory**. Wraps the entire application, defining `<html>` and `<body>` tags. |
| **Scoped Layout** | `layout.js` in a subdirectory | Wraps all pages and nested layouts within that directory. |
| **Multiple Layouts** | Achieved with **Group Routing** | Allows distinct top-level layouts (e.g., public vs. admin) while maintaining clean URLs. |

---

### B. Layout vs Template: Understanding the Difference

Both `layout.tsx` and `template.tsx` wrap child components, but they behave **very differently** when navigating between routes.

#### Key Differences

| Feature | `layout.tsx` | `template.tsx` |
| :--- | :--- | :--- |
| **Re-renders on navigation** | ❌ No - Persists across routes | ✅ Yes - Creates new instance for each route |
| **State preservation** | ✅ Preserved when navigating | ❌ Reset on every navigation |
| **DOM elements** | Reused across navigations | Recreated on every navigation |
| **Use case** | Shared UI that should persist | UI that should reset between routes |
| **Performance** | Better (no re-render) | Slightly slower (re-renders) |

---

#### When to Use `layout.tsx`

Use layouts when you want UI and state to **persist** across route changes.

**Example: `app/(auth)/layout.tsx`** (if it were a layout)

```tsx
"use client";
import { useState } from "react";
import AuthNavbar from "../components/AuthNavbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  
  return (
    <html>
      <body>
        <AuthNavbar />
        <main>
          {/* This input value PERSISTS when navigating between /login and /register */}
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
          />
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Behavior**: When navigating from `/login` → `/register`, the input value **stays the same**.

**Use Cases:**
- Navigation bars that should persist
- Sidebar state (open/closed)
- Shopping cart state
- User authentication state
- Any shared UI that shouldn't reset

---

#### When to Use `template.tsx`

Use templates when you want UI and state to **reset** on every route change.

**Example: `app/(auth)/template.tsx`**

```tsx
"use client";
import { useState } from "react";
import AuthNavbar from "../components/AuthNavbar";

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState("");
  
  return (
    <html>
      <body>
        <AuthNavbar />
        <main>
          {/* This input value RESETS when navigating between /login and /register */}
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
          />
          {children}
        </main>
      </body>
    </html>
  );
}
```

**Behavior**: When navigating from `/login` → `/register`, the input value **resets to empty**.

**Use Cases:**
- Forms that should clear between pages
- Animations that should replay on each page
- Focus management that should reset
- Temporary UI state (modals, tooltips)
- Page-specific filters or search inputs

---

#### Visual Comparison

**With `layout.tsx`:**
```
User types "hello" in input on /login
↓
Navigates to /register
↓
Input still shows "hello" ✅ (State persisted)
```

**With `template.tsx`:**
```
User types "hello" in input on /login
↓
Navigates to /register
↓
Input is empty "" ✅ (State reset)
```

---

#### Technical Details

**Layout Behavior:**
- Component instance is created once
- React maintains the component tree
- Only child content (`{children}`) updates
- State, refs, and effects persist

**Template Behavior:**
- New component instance created on each navigation
- React unmounts and remounts the entire template
- All state is reset to initial values
- Effects run again (useEffect cleanup + setup)

---

#### Can You Use Both?

Yes! You can have both `layout.tsx` and `template.tsx` in the same directory. The structure will be:

```
<Layout>
  <Template>
    {children}
  </Template>
</Layout>
```

The layout wraps the template, so:
- Layout state persists
- Template state resets

---

### C. Loading States with `loading.tsx`

The `loading.tsx` file is a special file that automatically creates a loading UI shown while a page or route segment is loading. It uses React Suspense under the hood.

#### How It Works

When you navigate to a route with a `loading.tsx` file:
1. The loading UI is shown **immediately**
2. The page content loads in the background
3. Once loaded, the loading UI is automatically replaced with the page content

#### Basic Example

**File: `app/blog/loading.tsx`**

```tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

**File: `app/blog/page.tsx`**

```tsx
export default async function Blog() {
  // Simulate slow data fetch (2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  return <h1>Blog</h1>;
}
```

**User Experience:**
1. User navigates to `/blog`
2. Sees "Loading..." immediately
3. After 2 seconds, sees "Blog" heading

---

#### Scope and Hierarchy

The `loading.tsx` file applies to:
- The `page.tsx` in the same directory
- All nested route segments (unless they have their own `loading.tsx`)

**Example Directory Structure:**

```
app/
├── blog/
│   ├── loading.tsx        ← Applies to /blog and /blog/[id]
│   ├── page.tsx           ← Shows loading.tsx while loading
│   └── [id]/
│       └── page.tsx       ← Also shows parent loading.tsx
└── products/
    ├── loading.tsx        ← Different loading UI for products
    └── page.tsx
```

---

#### Styling Loading States

You can create more sophisticated loading UIs:

**Example: Skeleton Loading**

```tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  );
}
```

**Example: Spinner**

```tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
}
```

---

#### When Loading UI is Shown

Loading UI appears when:
- **Initial navigation** to a route with async Server Components
- **Route transitions** that require data fetching
- **Slow network** or database queries

Loading UI does NOT appear when:
- Using Client Components without async data fetching
- Data is already cached
- Navigation is instant (no async operations)

---

#### Loading UI vs Suspense Boundaries

`loading.tsx` is essentially a convenient wrapper around React Suspense:

**Using `loading.tsx`:**
```tsx
// app/blog/loading.tsx
export default function Loading() {
  return <p>Loading...</p>;
}
```

**Equivalent with Suspense (manual):**
```tsx
// app/blog/layout.tsx
import { Suspense } from "react";

export default function BlogLayout({ children }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {children}
    </Suspense>
  );
}
```

The `loading.tsx` approach is simpler and recommended for most cases.

---

#### Best Practices

| Practice | Description |
| :--- | :--- |
| **Match the layout** | Loading UI should match the expected page structure (headers, sidebars, etc.) |
| **Use skeletons** | Skeleton screens provide better UX than spinners for content-heavy pages |
| **Keep it simple** | Loading UI should be lightweight and render instantly |
| **Consider placement** | Place `loading.tsx` at the appropriate level (route-specific vs. shared) |
| **Avoid heavy logic** | Don't fetch data or run expensive operations in loading components |

---

#### Common Use Cases

**1. Blog Posts with Slow Database Queries**
```
app/blog/
├── loading.tsx    ← "Loading posts..."
└── page.tsx       ← Fetches posts from database
```

**2. Product Pages with API Calls**
```
app/products/
├── [id]/
│   ├── loading.tsx    ← Product skeleton
│   └── page.tsx       ← Fetches product details
```

**3. Dashboard with Multiple Data Sources**
```
app/dashboard/
├── loading.tsx    ← Dashboard skeleton
└── page.tsx       ← Fetches user data, analytics, etc.
```

---

### D. Error Handling with `error.tsx`

Next.js provides a powerful error handling system using `error.tsx` files. These files automatically create error boundaries that catch errors in their route segment and child segments.

#### How Error Boundaries Work

Error boundaries in Next.js:
1. **Catch runtime errors** in Server and Client Components
2. **Display fallback UI** instead of crashing the entire app
3. **Provide recovery mechanisms** (reset/retry functionality)
4. **Follow a hierarchy** - errors bubble up to the nearest error boundary

---

#### Basic Error Boundary

**File: `app/error/error.tsx`**

```tsx
"use client"; // Error boundaries MUST be Client Components

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function ErrorBoundary({ 
  error, 
  reset 
}: { 
  error: Error, 
  reset: () => void 
}) {
  const router = useRouter();
  
  const reload = () => {
    startTransition(() => {
      router.refresh(); // Refresh server data
      reset();          // Reset error boundary
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>{error.message}</h1>
      <button 
        className="bg-slate-600 text-white p-2 cursor-pointer" 
        onClick={reload}
      >
        Try Again
      </button>
    </div>
  );
}
```

**Props Provided:**
- **`error`**: The error object that was thrown
- **`reset`**: Function to reset the error boundary and re-render the segment

---

#### Error Hierarchy

Error boundaries follow a hierarchical structure. Errors bubble up to the **nearest parent** `error.tsx` file.

**Directory Structure:**

```
app/
├── global-error.tsx           ← Catches errors in root layout
├── (main)/
│   ├── layout.tsx             ← Root layout
│   ├── error/
│   │   ├── error.tsx          ← Catches errors in /error and children
│   │   ├── page.tsx
│   │   └── error1/
│   │       ├── layout.tsx     ← Can throw errors
│   │       ├── page.tsx
│   │       └── error2/
│   │           └── error3/
│   │               └── page.tsx
```

**Error Catching Rules:**

| Error Location | Caught By |
| :--- | :--- |
| Error in `/error/error1/error2/error3/page.tsx` | `/error/error.tsx` |
| Error in `/error/error1/layout.tsx` | `/error/error.tsx` |
| Error in `/error/page.tsx` | `/error/error.tsx` |
| Error in root `layout.tsx` | `global-error.tsx` |

---

#### Example: Error in Nested Layout

**File: `app/error/error1/layout.tsx`**

```tsx
const getRandomInit = (max: number) => {
  return Math.floor(Math.random() * max);
};

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
  const random = getRandomInit(2);
  
  // 50% chance to throw an error
  if (random === 1) {
    throw new Error("Error in layout of page 1");
  }
  
  return (
    <div>
      <footer>Error hierarchy example</footer>
      {children}
    </div>
  );
}
```

**Behavior:**
- When error is thrown, it's caught by `/error/error.tsx`
- The error boundary displays the fallback UI
- User can click "Try Again" to retry

---

#### Global Error Boundary

`global-error.tsx` is a special error boundary that catches errors in the **root layout**. It must include its own `<html>` and `<body>` tags.

**File: `app/global-error.tsx`**

```tsx
"use client";

import "./globals.css";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <button
            onClick={() => {
              window.location.reload(); // Full page reload
            }}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          >
            Refresh
          </button>
        </div>
      </body>
    </html>
  );
}
```

**When to Use:**
- Catches errors in the root `layout.tsx`
- Last resort error boundary
- Rarely triggered in production

---

#### Error Simulator for Testing

You can create a component to simulate errors for testing purposes:

**File: `app/(main)/error-wrapper.tsx`**

```tsx
"use client";
import { useState } from "react";

const ErrorSimulator = ({ message = "An error occurred" }: { message?: string }) => {
  const [error, setError] = useState(false);

  if (error) throw new Error(message);

  return (
    <button
      className="bg-red-500 text-white p-2 rounded"
      onClick={() => setError(true)}
    >
      Simulate Error
    </button>
  );
};

export const ErrorWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative p-4 border border-gray-300">
      <div className="absolute top-0 left-4">
        <ErrorSimulator message="Simulated error in root layout" />
      </div>
      {children}
    </div>
  );
};
```

**Usage in Layout:**

```tsx
import { ErrorWrapper } from "./error-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <ErrorWrapper>
        {children}
      </ErrorWrapper>
    </main>
  );
}
```

---

#### Error Boundary Limitations

⚠️ **Important Limitations:**

| What Error Boundaries Catch | What They DON'T Catch |
| :--- | :--- |
| ✅ Errors in Server Components | ❌ Errors in the same `layout.tsx` where `error.tsx` is defined |
| ✅ Errors in Client Components | ❌ Errors in `error.tsx` itself |
| ✅ Errors during rendering | ❌ Errors in event handlers (use try-catch) |
| ✅ Errors in child components | ❌ Errors in async code outside rendering |

**Example - Error in Same Layout:**

```
app/
├── error/
│   ├── error.tsx      ← Cannot catch errors in layout.tsx at same level
│   ├── layout.tsx     ← Errors here bubble up to parent error.tsx
│   └── page.tsx       ← Errors here are caught by error.tsx
```

---

#### Best Practices

| Practice | Description |
| :--- | :--- |
| **Always use "use client"** | Error boundaries must be Client Components |
| **Provide recovery options** | Include "Try Again" or "Go Home" buttons |
| **Log errors** | Send error details to monitoring services (Sentry, LogRocket) |
| **User-friendly messages** | Don't show technical stack traces to users |
| **Test error boundaries** | Use error simulators to test error handling |
| **Granular boundaries** | Place error.tsx at appropriate levels for better UX |

---

#### Recovery Strategies

**1. Reset Error Boundary**
```tsx
<button onClick={() => reset()}>
  Try Again
</button>
```

**2. Refresh Server Data**
```tsx
<button onClick={() => {
  router.refresh();
  reset();
}}>
  Reload Data
</button>
```

**3. Navigate Away**
```tsx
<button onClick={() => router.push("/")}>
  Go Home
</button>
```

**4. Full Page Reload (Last Resort)**
```tsx
<button onClick={() => window.location.reload()}>
  Refresh Page
</button>
```

---

#### Error Hierarchy Visual

```
┌─────────────────────────────────────┐
│ global-error.tsx                    │ ← Catches root layout errors
│  ┌───────────────────────────────┐  │
│  │ Root Layout                   │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │ /error/error.tsx        │  │  │ ← Catches /error/* errors
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │ /error/page.tsx   │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │ /error/error1/    │  │  │  │
│  │  │  │   layout.tsx      │  │  │  │ ← Error here caught by parent
│  │  │  │   page.tsx        │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

### E. Not Found Handling

- **Global Not Found**: Defined by `app/not-found.js`.
- **Local Not Found**: Defined by a local `not-found.js` file. To trigger it manually from code (e.g., if a database item is missing), you must call the **`notFound()` function**.

### F. Metadata (SEO)

Metadata must always be defined in **Server Components** (`page.js` or `layout.js`).

| Metadata Goal       | Configuration Method                                         | Key Detail                                                                                   |
| :------------------ | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Global Defaults** | Exported `metadata` object in `app/layout.js`.               | Use `title: { default: '...', template: '...' }` to create a consistent title structure.     |
| **Local Overrides** | Exported `metadata` object in a specific `page.js`.          | Use `title: { absolute: '...' }` to ignore the global template for that page.                |
| **Dynamic Content** | Export an **`async function generateMetadata({ params })`**. | Allows you to fetch data based on route parameters and generate dynamic titles/descriptions. |

---

## 7. 🔀 Parallel Routes

Parallel routes allow you to **simultaneously render multiple pages in the same layout** using **named slots**. This is particularly useful for complex dashboards and multi-panel interfaces.

### Concept

Parallel routes are defined using the **`@folder`** naming convention. Each folder prefixed with `@` becomes a **named slot** that can be independently rendered within a parent layout.

#### Directory Structure

```
app/
└── complex-dashboard/
    ├── layout.tsx          # Receives slots as props
    ├── page.tsx            # Optional default content
    ├── @notifications/     # Named slot
    │   └── page.tsx
    ├── @revenue/          # Named slot
    │   └── page.tsx
    └── @users/            # Named slot
        └── page.tsx
```

---

### How It Works

#### 1. Named Slots Definition

Each `@folder` creates a named slot that becomes a prop in the parent layout:

- `@notifications` → `notifications` prop
- `@revenue` → `revenue` prop
- `@users` → `users` prop

#### 2. Layout Receives Slots as Props

**Example: `app/complex-dashboard/layout.tsx`**

```tsx
export default function ComplexDashboardLayout({
  children,
  users,
  revenue,
  notifications,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  revenue: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div>
      <header>Complex Dashboard</header>
      {children}
      <div className="flex gap-4">
        <div className="flex-1 h-full flex flex-col gap-4 w-full">
          <div className="flex-1">{users}</div>
          <div className="flex-1">{revenue}</div>
        </div>
        <div className="flex-1 h-full">{notifications}</div>
      </div>
    </div>
  );
}
```

#### 3. Individual Slot Pages

**`@users/page.tsx`**
```tsx
import Card from "@/src/app/components/Card";

export default function UserAnalyticsPage() {
  return <Card>User Analytics Page</Card>;
}
```

**`@revenue/page.tsx`**
```tsx
import Card from "@/src/app/components/Card";

export default function RevenueMetricsPage() {
  return <Card>Revenue Metrics Page</Card>;
}
```

**`@notifications/page.tsx`**
```tsx
import Card from "@/src/app/components/Card";

export default function NotificationsPage() {
  return <Card>Notifications Page</Card>;
}
```

---

### Key Benefits

| Benefit | Description | Use Case |
| :--- | :--- | :--- |
| **Independent Loading States** | Each slot can have its own `loading.tsx` and `error.tsx` | Heavy data sections load independently without blocking the entire page |
| **Sub-Navigation** | Each slot maintains its own navigation state | Email client with independent list and detail navigation |
| **Conditional Rendering** | Render slots based on user roles, permissions, or logic | Admin panel showing different sections for different user types |
| **Code Organization** | Separates complex sections into manageable modules | Large dashboards split into focused, maintainable components |
| **Flexible Layouts** | Complete control over positioning without prop drilling | Custom grid layouts, split views, multi-column designs |
| **Streaming & Suspense** | Each slot can stream independently | Improved perceived performance for data-heavy dashboards |

---

### Real-World Use Cases

#### 1. **Analytics Dashboard**
```
/dashboard/
  ├── @users/          # User metrics (slow query)
  ├── @revenue/        # Revenue charts (fast query)
  └── @notifications/  # Real-time notifications
```
Revenue loads instantly while users wait for analytics.

#### 2. **Email Client**
```
/mail/
  ├── @inbox/          # Email list
  └── @preview/        # Email detail
```
Independent navigation in each panel.

#### 3. **Admin Interface**
```
/admin/
  ├── @sidebar/        # Navigation
  ├── @main/           # Content area
  └── @activity/       # Activity feed
```
Each section updates independently.

#### 4. **A/B Testing**
```tsx
export default function Layout({ variant_a, variant_b }) {
  const showVariantA = Math.random() > 0.5;
  return showVariantA ? variant_a : variant_b;
}
```
Conditionally render different implementations.

---

### Important Notes

- **Slots are NOT route segments**: `@folder` doesn't affect the URL structure
- **All slots render simultaneously**: Unlike nested routes, parallel routes render at the same time
- **Props are automatic**: Next.js automatically passes slot content as props to the parent layout
- **Optional `children`**: The layout can still receive regular `children` from a `page.tsx` in the same directory

---

### Comparison: Parallel Routes vs Nested Routes

| Feature | Parallel Routes | Nested Routes |
| :--- | :--- | :--- |
| **URL Structure** | No effect on URL | Creates URL segments |
| **Rendering** | Simultaneous | Sequential (parent → child) |
| **Layout Props** | Named props (`users`, `revenue`) | `children` only |
| **Independence** | Fully independent | Hierarchical dependency |
| **Use Case** | Multi-panel UIs | Hierarchical navigation |

---

### Default Files (`default.tsx`)

When using parallel routes, **`default.tsx`** files act as **fallbacks** for slots that don't have a matching route during navigation.

#### The Problem

When navigating to a sub-route within one parallel slot, Next.js needs to know what to render in the **other slots** that don't have a matching route.

**Example Scenario:**

```
complex-dashboard/
├── page.tsx                    # /complex-dashboard
├── default.tsx                 # Fallback for children
├── @notifications/
│   ├── page.tsx               # /complex-dashboard
│   └── archived/
│       └── page.tsx           # /complex-dashboard/archived ✓
├── @revenue/
│   ├── page.tsx               # /complex-dashboard
│   └── default.tsx            # Fallback when no match
└── @users/
    ├── page.tsx               # /complex-dashboard
    └── default.tsx            # Fallback when no match
```

---

#### How It Works

**Scenario 1: Navigate to `/complex-dashboard`**

All slots have matching `page.tsx` files:

```tsx
Layout receives:
- children: <ComplexDashboardPage />
- notifications: <NotificationsPage />
- revenue: <RevenueMetricsPage />
- users: <UserAnalyticsPage />
```

✅ All slots render their `page.tsx`

---

**Scenario 2: Navigate to `/complex-dashboard/archived`**

Only `@notifications` has an `archived/page.tsx`:

**Without `default.tsx` files:**
- ❌ `@revenue` and `@users` would show 404 errors
- ❌ Layout breaks because slots have no content

**With `default.tsx` files:**
```tsx
Layout receives:
- children: <ComplexDashboardDefaultPage />        // default.tsx
- notifications: <ArchivedNotificationsPage />     // archived/page.tsx ✓
- revenue: <RevenueMetricsDefaultPage />           // @revenue/default.tsx
- users: <UserAnalyticsDefaultPage />              // @users/default.tsx
```

✅ Slots without matching routes fall back to `default.tsx`

---

#### Implementation Examples

**`@revenue/default.tsx`**
```tsx
import Card from "@/src/app/components/Card";

export default function RevenueMetricsDefaultPage() {
    return <Card>Revenue Metrics Default Page</Card>;
}
```

**`@users/default.tsx`**
```tsx
import Card from "@/src/app/components/Card";

export default function UserAnalyticsDefaultPage() {
    return <Card>User Analytics Default Page</Card>;
}
```

**`default.tsx` (for children slot)**
```tsx
export default function ComplexDashboardDefaultPage() {
    return <div>Complex Dashboard Default Page</div>;
}
```

---

#### Key Rules

| Rule | Explanation |
| :--- | :--- |
| **Fallback mechanism** | Renders when a slot has no matching route for the current URL |
| **Required for sub-routes** | Without it, unmatched slots will 404 when navigating to sub-routes |
| **Per-slot basis** | Each slot (`@folder`) needs its own `default.tsx` |
| **Children slot too** | The main `children` slot also needs a `default.tsx` at the parent level |
| **Client-side only** | Only used during client-side navigation, not on initial page load |

---

#### Navigation Flow Example

**User Journey:**

1. **Visit `/complex-dashboard`**
   - All slots render their `page.tsx` files

2. **Click link to `/complex-dashboard/archived`**
   - `@notifications` → renders `archived/page.tsx` ✓
   - `@revenue` → no `archived/page.tsx`, falls back to `default.tsx`
   - `@users` → no `archived/page.tsx`, falls back to `default.tsx`
   - `children` → no `archived/page.tsx`, falls back to `default.tsx`

3. **Click link back to `/complex-dashboard`**
   - All slots return to their `page.tsx` files

---

#### Best Practices

**1. Always Provide `default.tsx`**
```tsx
// Prevents 404 errors during navigation
export default function DefaultSlot() {
  return <div>Loading...</div>;
}
```

**2. Match the Slot's Purpose**
```tsx
// Keep default content relevant to the slot
export default function RevenueDefault() {
  return <Card>Revenue Metrics</Card>; // Not "404" or unrelated content
}
```

**3. Consider Using `null`**
```tsx
// If a slot shouldn't show anything when unmatched
export default function DefaultSlot() {
  return null;
}
```

**4. Reuse Components**
```tsx
// Reuse the main page component if appropriate
import RevenueMetricsPage from './page';

export default RevenueMetricsPage;
```

---

#### Common Mistake

❌ **Forgetting `default.tsx`:**
```
@revenue/
└── page.tsx        # ❌ Missing default.tsx
```

**Result:** When navigating to `/complex-dashboard/archived`, the `@revenue` slot will 404.

✅ **Correct:**
```
@revenue/
├── page.tsx
└── default.tsx     # ✓ Fallback provided
```

---

#### Summary

**`default.tsx`** ensures that parallel routes remain **resilient during navigation**. When one slot navigates to a sub-route, other slots gracefully fall back to their default content instead of breaking the layout or showing 404 errors.

---

## 8. 🔗 Intercepting Routes

Intercepting routes allow you to **intercept navigation** and display a different route within the current layout, while keeping the URL updated. This is commonly used for modals, overlays, and contextual content.

### Concept

When a user navigates via a `<Link>` component, you can "intercept" that navigation and show alternative content **without leaving the current page**. However, if the user refreshes the page or navigates directly via URL, the actual target route is displayed.

**Key Use Case:** Opening a photo in a modal overlay while browsing a feed, but showing the full photo page on direct URL access or refresh.

---

### Convention Syntax

Intercepting routes use parentheses with special dot notation to define the **relative path** to intercept:

| Convention | Meaning | Intercepts From | Example |
| :--- | :--- | :--- | :--- |
| **`(.)`** | Same level | Current segment | `f1/(.)f2` intercepts `/f1/f2` from `/f1` |
| **`(..)`** | One level up | Parent segment | `f1/(..f3` intercepts `/f3` from `/f1` |
| **`(..)(..)`** | Two levels up | Grandparent segment | `f1/f2/(..)(..)f4` intercepts `/f4` from `/f1/f2` |
| **`(...)`** | Root level | From app root | `f1/f2/inner-f2/(...)f5` intercepts `/f5` from any depth |

---

### Directory Structure Example

```
app/
├── f1/
│   ├── page.tsx                    # /f1
│   ├── (.)f2/
│   │   └── page.tsx               # Intercepts /f1/f2 when navigating from /f1
│   ├── (..)f3/
│   │   └── page.tsx               # Intercepts /f3 when navigating from /f1
│   └── f2/
│       ├── page.tsx                # /f1/f2 (actual route)
│       ├── (..)(..)f4/
│       │   └── page.tsx           # Intercepts /f4 when navigating from /f1/f2
│       └── inner-f2/
│           ├── page.tsx            # /f1/f2/inner-f2
│           └── (...)f5/
│               └── page.tsx       # Intercepts /f5 from root
├── f3/
│   └── page.tsx                    # /f3 (actual route)
├── f4/
│   └── page.tsx                    # /f4 (actual route)
└── f5/
    └── page.tsx                    # /f5 (actual route)
```

---

### How It Works

#### 1. **`(.)` - Same Level Interception**

Intercepts a route at the **same segment level**.

**File Structure:**
```
f1/
├── page.tsx           # /f1
├── (.)f2/
│   └── page.tsx      # Intercepts /f1/f2
└── f2/
    └── page.tsx      # /f1/f2 (actual)
```

**`f1/page.tsx`**
```tsx
import Link from "next/link";

export default function F1Page() {
    return <div>F1 Page
        <Link href="/f1/f2">move to F2</Link>
    </div>;
}
```

**Behavior:**
- **Click link from `/f1`** → Shows `(.)f2/page.tsx` (intercepted version)
- **Direct visit `/f1/f2`** → Shows `f2/page.tsx` (actual route)
- **Refresh on `/f1/f2`** → Shows `f2/page.tsx` (actual route)

**`f1/(.)f2/page.tsx`**
```tsx
export default function F2Page() {
    return <div>(.)F2 Page</div>;  // Intercepted version
}
```

---

#### 2. **`(..)` - One Level Up Interception**

Intercepts a route **one segment level up** (parent level).

**File Structure:**
```
f1/
├── page.tsx           # /f1
└── (..)f3/
    └── page.tsx      # Intercepts /f3
f3/
└── page.tsx          # /f3 (actual)
```

**`f1/page.tsx`**
```tsx
import Link from "next/link";

export default function F1Page() {
    return <div>F1 Page
        <Link href="/f3">move to F3</Link>
    </div>;
}
```

**Behavior:**
- **Click link from `/f1`** → Shows `(..)f3/page.tsx` (intercepted)
- **Direct visit `/f3`** → Shows `f3/page.tsx` (actual)

**`f1/(..)f3/page.tsx`**
```tsx
export default function F3Page() {
    return <div>(..)F3 Page</div>;  // Intercepted version
}
```

---

#### 3. **`(..)(..)`** - Two Levels Up Interception

Intercepts a route **two segment levels up** (grandparent level).

**File Structure:**
```
f1/
└── f2/
    ├── page.tsx           # /f1/f2
    └── (..)(..)f4/
        └── page.tsx      # Intercepts /f4
f4/
└── page.tsx              # /f4 (actual)
```

**`f1/f2/page.tsx`**
```tsx
import Link from "next/link";

export default function F2Page() {
    return <div>F2 Page
        <Link href="/f4">move to F4</Link>
    </div>;
}
```

**Behavior:**
- **Click link from `/f1/f2`** → Shows `(..)(..)f4/page.tsx` (intercepted)
- **Direct visit `/f4`** → Shows `f4/page.tsx` (actual)

**`f1/f2/(..)(..)f4/page.tsx`**
```tsx
export default function F4Page() {
    return <div>(..)(..)F4 Page</div>;  // Intercepted version
}
```

---

#### 4. **`(...)`** - Root Level Interception

Intercepts a route from the **app root**, regardless of current depth.

**File Structure:**
```
f1/
└── f2/
    └── inner-f2/
        ├── page.tsx           # /f1/f2/inner-f2
        └── (...)f5/
            └── page.tsx      # Intercepts /f5 from root
f5/
└── page.tsx                  # /f5 (actual)
```

**`f1/f2/inner-f2/page.tsx`**
```tsx
import Link from "next/link";

export default function InnerF2Page() {
    return <div>Inner F2 Page
        <Link href="/f5">move to F5</Link>
    </div>;
}
```

**Behavior:**
- **Click link from `/f1/f2/inner-f2`** → Shows `(...)f5/page.tsx` (intercepted)
- **Direct visit `/f5`** → Shows `f5/page.tsx` (actual)

**`f1/f2/inner-f2/(...)f5/page.tsx`**
```tsx
export default function F5Page() {
    return <div>(...)F5 Page</div>;  // Intercepted version
}
```

---

### Navigation Behavior Summary

| Action | Result |
| :--- | :--- |
| **Click `<Link>` from intercepting page** | Shows intercepted route |
| **Direct URL navigation** | Shows actual route |
| **Browser refresh** | Shows actual route |
| **Back button** | Returns to previous page (intercepted route disappears) |

---

### Real-World Use Cases

#### 1. **Photo Gallery Modal**
```
feed/
├── page.tsx              # Photo grid
└── (.)photo/
    └── [id]/
        └── page.tsx     # Modal overlay
photo/
└── [id]/
    └── page.tsx         # Full photo page
```
- Click photo in feed → Modal overlay
- Direct link `/photo/123` → Full page

#### 2. **Login Modal**
```
dashboard/
├── page.tsx
└── (...)login/
    └── page.tsx         # Login modal
login/
└── page.tsx             # Full login page
```
- Click "Login" from dashboard → Modal
- Direct `/login` → Full page

#### 3. **Product Quick View**
```
products/
├── page.tsx             # Product list
└── (.)product/
    └── [id]/
        └── page.tsx    # Quick view drawer
product/
└── [id]/
    └── page.tsx        # Full product page
```

---

### Important Notes

- **Client-side navigation only**: Interception only works with `<Link>` component navigation
- **Two versions required**: You need both the intercepting route AND the actual route
- **URL updates**: The URL changes to the target route, but the intercepted content is shown
- **Refresh behavior**: Refreshing shows the actual route, not the intercepted version
- **Route groups ignored**: `(.)` doesn't count route groups like `(main)` when calculating levels

---

### Best Practices

**1. Use for Contextual Content**
```tsx
// Good: Modal that maintains context
feed/(.)photo/[id]/page.tsx  // Shows photo without losing feed position
```

**2. Provide Fallback Routes**
```tsx
// Always create the actual route for direct access
photo/[id]/page.tsx  // Full page version
```

**3. Combine with Parallel Routes**
```tsx
// Powerful combination for modals
@modal/(.)photo/[id]/page.tsx  // Modal slot
```

**4. Handle Close Actions**
```tsx
"use client";
import { useRouter } from "next/navigation";

export default function InterceptedPage() {
    const router = useRouter();
    return (
        <div>
            <button onClick={() => router.back()}>Close</button>
        </div>
    );
}
```

---

### Common Patterns

#### Modal Pattern
```
app/
├── @modal/
│   └── (.)photo/
│       └── [id]/
│           └── page.tsx    # Modal
├── photo/
│   └── [id]/
│       └── page.tsx        # Full page
└── layout.tsx              # Renders {children} and {modal}
```

#### Drawer Pattern
```
products/
├── (.)product/
│   └── [id]/
│       └── page.tsx        # Slide-in drawer
└── product/
    └── [id]/
        └── page.tsx        # Full page
```

---

### Practical Example: Photo Feed with Modal Interception

This example demonstrates a real-world implementation of intercepted routes combined with parallel routes to create a photo gallery with modal overlays.

#### Project Structure

```
app/(main)/photo-feed/
├── @modal/                          # Parallel route slot
│   ├── (.)[id]/
│   │   └── page.tsx                # Intercepted modal view
│   └── default.tsx                 # Default slot content (null)
├── [id]/
│   └── page.tsx                    # Full photo page
├── photos/                         # Static images
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── layout.tsx                      # Renders both children and modal slot
├── page.tsx                        # Photo grid/feed
└── wonders.tsx                     # Photo data
```

#### Implementation Details

**1. Photo Feed Page (`page.tsx`)**

Displays a grid of photos with links to individual photo pages:

```tsx
import Link from "next/link";
import Image from "next/image";
import wonders from "./wonders";

export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-center text-3xl font-bold my-4">
        New Wonders of the World
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {wonders.map(({ id, src, name }) => (
          <Link key={id} href={`/photo-feed/${id}`}>
            <Image
              alt={name}
              src={src}
              width={500}
              height={500}
              className="w-full object-cover aspect-square"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
```

**2. Layout with Parallel Routes (`layout.tsx`)**

Renders both the main content and the modal slot:

```tsx
export default function Layout(props: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {props.modal}
      {props.children}
    </>
  );
}
```

**3. Intercepted Modal Route (`@modal/(.)[id]/page.tsx`)**

Shows photo in a modal when navigating from the feed:

```tsx
import Image from "next/image";
import wondersImages, { WonderImage } from "../../wonders";
import Modal from "@/src/app/components/Modal";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo: WonderImage = wondersImages.find((p) => p.id === id)!;

  return (
    <Modal>
      <Image
        alt={photo.name}
        src={photo.src}
        className="w-full object-cover aspect-square"
      />
      <div className="bg-white p-4">
        <h2 className="text-xl font-semibold">{photo.name}</h2>
        <h3>{photo.photographer}</h3>
        <h3>{photo.location}</h3>
      </div>
    </Modal>
  );
}
```

**4. Full Photo Page (`[id]/page.tsx`)**

Shows the full photo page when accessed directly or after refresh:

```tsx
import Image from "next/image";
import wondersImages, { WonderImage } from "../wonders";

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo: WonderImage = wondersImages.find((p) => p.id === id)!;
  
  return (
    <div className="container mx-auto my-10">
      <div className="w-1/2 mx-auto">
        <h1 className="text-center text-3xl font-bold my-4">{photo.name}</h1>
        <Image
          alt={photo.name}
          src={photo.src}
          className="w-full object-cover aspect-square"
        />
        <div className="bg-white py-4">
          <h3>{photo.photographer}</h3>
          <h3>{photo.location}</h3>
        </div>
      </div>
    </div>
  );
}
```

**5. Modal Component (`components/Modal.tsx`)**

Reusable modal with close functionality:

```tsx
"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      ref={overlay}
      className="fixed z-10 left-0 right-0 top-0 bottom-0 mx-auto bg-black/60 p-10"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:w-10/12 md:w-8/12 lg:w-2/5 p-6"
      >
        {children}
      </div>
    </div>
  );
}
```

**6. Default Slot (`@modal/default.tsx`)**

Returns null when no modal should be shown:

```tsx
export default function Default() {
  return null;
}
```

#### User Experience Flow

**Scenario 1: Click from Feed**
```
1. User is on /photo-feed
2. Clicks photo #3
3. URL changes to /photo-feed/3
4. Modal opens with photo (intercepted route)
5. Feed remains visible in background
6. User clicks outside or presses ESC
7. Modal closes, returns to /photo-feed
```

**Scenario 2: Direct URL Access**
```
1. User navigates directly to /photo-feed/3
2. Full photo page is displayed (actual route)
3. No modal, no feed in background
```

**Scenario 3: Refresh**
```
1. User clicks photo from feed (modal opens)
2. URL is /photo-feed/3
3. User refreshes page
4. Full photo page is displayed (actual route)
5. Modal is gone
```

#### Key Benefits

- **Maintains Context**: Users stay on the feed while viewing photos
- **Shareable URLs**: Each photo has a unique URL that works independently
- **Progressive Enhancement**: Works with or without JavaScript
- **Better UX**: Faster navigation with modal, full page as fallback
- **SEO Friendly**: Search engines index the full photo pages

#### Important Notes

- The `(.)` notation intercepts routes at the **same segment level**
- Route groups like `(main)` are **ignored** when calculating interception levels
- The `@modal` parallel route slot must have a `default.tsx` that returns null
- Modal component uses `router.back()` to close, maintaining navigation history

---

### Summary

**Intercepting routes** enable sophisticated UX patterns by showing alternative content during client-side navigation while preserving the ability to access the full route directly. The dot notation `(.)`, `(..)`, `(..)(..)`, and `(...)` provides flexible control over which routes to intercept based on the current location in the route hierarchy.

---
