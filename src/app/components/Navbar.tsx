"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
    const pathname = usePathname();
    const routes = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About" },
        { path: "/counter", label: "Counter" },
        { path: "/blog", label: "Blog" },
        { path: "/articles", label: "Articles" },
        { path: "/order-product", label: "Order Product" },
        { path: "/products", label: "Products" },
        { path: "/docs/features/concept1", label: "Docs" },
        { path: "/login", label: "Account" },
        { path: "/profile", label: "Profile" },
        { path: "/_lib", label: "Private Route" },
        { path: "/_underscore-route", label: "Underscore Route" },
        { path: "/complex-dashboard", label: "Complex Dashboard" },
    ]
    return (
        <nav>
            <ul className="flex gap-4 bg-slate-600 text-white p-4">
                {routes.map((route) => {
                    const isActive = pathname === route.path || pathname.startsWith(route.path + "/");
                    return (
                        <li key={route.path} className={isActive ? "text-amber-500 font-bold" : ""}>
                            <Link href={route.path}>{route.label}</Link>
                        </li>
                    )
                })}
            </ul>

        </nav>

    );
}

