"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error, reset: () => void }) {
    const router = useRouter();
    const reload = () => {
        startTransition(() => {
            router.refresh();
            reset();
        })
    }

    return <div className="flex flex-col items-center justify-center"><h1>{error.message}<button className="bg-slate-600 text-white p-2 cursor-pointer" onClick={reload}>Try Again</button></h1></div>;
}