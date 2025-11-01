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

* **App Directory (`app`)**: All routes and shared UI must reside here. The directory structure directly maps to URL paths.
* **Special Files**: These reserved filenames define UI and behavior for a route segment:
    * `page.js`: Defines the primary UI for a unique route.
    * `layout.js`: Defines shared UI that wraps child routes.
    * `not-found.js`: Defines a custom 404 error page.

---

## 2. 🧭 Routing & Navigation

Routing governs how paths map to code using specific directory naming conventions.

| Routing Type | Syntax/Convention | Purpose | Example URL |
| :--- | :--- | :--- | :--- |
| **Basic** | `folderName/page.js` | Defines a single route segment. | `/products` |
| **Nested** | Nested folders | Creates hierarchical URL paths. | `/dashboard/settings` |
| **Dynamic** | `[paramName]` | Captures a variable part of the URL (accessible via `params`). | `/users/42` |
| **Catch-All** | `[...paramName]` | Captures all subsequent path segments as an array. | `/docs/a/b/c` |
| **Group** | `(folderName)` | **Organizes files without affecting the URL**. Great for multiple top-level layouts. | `/login` (folder is `app/(auth)/login`) |
| **Private** | `_folderName` | Excludes a directory from routing. Used for local components or utility files. | *(Not accessible)* |

---

### 🧰 Router Navigation: `push` vs. `replace`

When navigating programmatically using the `useRouter()` hook or the `<Link>` component's `replace` prop, you control the browser's history stack.

| Prop | Behavior | Browser History Effect |
| :--- | :--- | :--- |
| **(default)** | `push` navigation | **Adds a new entry** to the history stack. |
| **`replace`** | `replace` navigation | **Overwrites the current entry** in the history stack. |

#### When to Use `replace`

Use `replace` when you **don't want users to be able to navigate "back"** to the previous route.

**Common Use Cases:**
* **Login Redirects**: Redirecting a user to a dashboard after a successful login.
* **Form Submissions**: Moving a user to a confirmation page after submitting data.
* **Automatic Navigation**: Any internal redirect that shouldn't be part of the user's manual browsing history.

**Example Code Context:**
```javascript
if (!user) {
  // Overwrites the current protected route in history, 
  // so the user cannot press "Back" to return here.
  router.replace('/login');
}
```

---

### 🔗 Active Link Styling with `usePathname`

To determine if a link is the currently active route and apply styling (e.g., highlighting), you must use the **`usePathname()`** hook.

* **Rule**: `usePathname` is a **Client Component hook**, meaning the component where you use it must be marked with `"use client";`.
* **Purpose**: It returns the **current URL pathname** (e.g., `/dashboard/settings`).

**Example Code Context:**

```javascript
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

## 3. 🎨 Layouts, UI, and Metadata

Layouts and metadata are essential for consistent UI and SEO.

### A. Layout Management

| Layout Type | Definition | Usage |
| :--- | :--- | :--- |
| **Root Layout** | `app/layout.js` | **Mandatory**. Wraps the entire application, defining `<html>` and `<body>` tags. |
| **Scoped Layout** | `layout.js` in a subdirectory | Wraps all pages and nested layouts within that directory. |
| **Multiple Layouts** | Achieved with **Group Routing** | Allows distinct top-level layouts (e.g., public vs. admin) while maintaining clean URLs. |

### B. Not Found Handling

* **Global Not Found**: Defined by `app/not-found.js`.
* **Local Not Found**: Defined by a local `not-found.js` file. To trigger it manually from code (e.g., if a database item is missing), you must call the **`notFound()` function**.

### C. Metadata (SEO)

Metadata must always be defined in **Server Components** (`page.js` or `layout.js`).

| Metadata Goal | Configuration Method | Key Detail |
| :--- | :--- | :--- |
| **Global Defaults** | Exported `metadata` object in `app/layout.js`. | Use `title: { default: '...', template: '...' }` to create a consistent title structure. |
| **Local Overrides** | Exported `metadata` object in a specific `page.js`. | Use `title: { absolute: '...' }` to ignore the global template for that page. |
| **Dynamic Content** | Export an **`async function generateMetadata({ params })`**. | Allows you to fetch data based on route parameters and generate dynamic titles/descriptions. |