"use client";
import { useRouter } from "next/navigation";
export default function OrderProductPage() {
    const router = useRouter();
    return <div className="flex flex-col items-center justify-center ">Order Product Page

        <button className="bg-blue-500 cursor-pointer text-white p-2" onClick={() => { router.push("/") }}>Order Now</button>
    </div>;
}