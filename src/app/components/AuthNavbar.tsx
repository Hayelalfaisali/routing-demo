"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function AuthNavbar() {
    const pathname = usePathname();
    const routes = [
        { path: "/", label: "Home" },
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
        { path: "/forgot-password", label: "Forgot Password" },
  
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

