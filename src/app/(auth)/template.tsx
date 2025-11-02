"use client";
import "../globals.css";
import AuthNavbar from "../components/AuthNavbar";
import { useState } from "react";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const [input, setInput] = useState("");
    return <html>
        <head>
            <title>Auth Layout</title>
        </head>
        <body className="flex flex-col min-h-screen">
            <AuthNavbar />
            <main className="flex-1 items-center justify-center">
                <input className="border m-2 border-slate-600 p-2" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
                {children}
            </main>
            <footer className="flex bg-slate-600 justify-center p-4 text-white" >
                <p>Auth Footer</p>
            </footer>
        </body>
    </html>

}