import Link from "next/link";

export default async function ArticlePage({params,searchParams}: {params: {articleId: string}, searchParams: {lang: "en" | "es" | "fr"}}) {
    const {articleId} = await params;
    const {lang} = await searchParams;
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

//client side example 

// "use client";
// import Link from "next/link";
// import { use } from "react";

// export default function ArticlePage({ params: Params, searchParams }: { params: Promise<{ articleId: string }>, searchParams: Promise<{ lang?: string }> }) {
//     const { articleId } = use(Params);
//     const { lang } = use(searchParams);
//     return (
//         <div>
//             <p>Article Id: {articleId}</p>
//             <p>Read Article language: {lang}</p>
//             <Link href={`/articles/${articleId}?lang=en`}>Read Article En</Link>
//             <Link href={`/articles/${articleId}?lang=es`}>Read Article Es</Link>
//             <Link href={`/articles/${articleId}?lang=fr`}>Read Article Fr</Link>
//         </div>
//     );
// }