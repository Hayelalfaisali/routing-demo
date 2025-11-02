"use client";

import { usePathname } from "next/navigation";

export default function NotFound() {//not accept params
    const pathName = usePathname();
    const productId = pathName.split('/')[2];
    const reviewId = pathName.split('/')[4];
    return <h1>404 - Review {reviewId} Not Found for Product {productId} </h1>;
}