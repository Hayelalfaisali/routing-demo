export default async function ArticleLayout({ children,params}: { children: React.ReactNode,params: Promise<{articleId: string}> }) {
    const {articleId} = await params;
    // const {lang} = await searchParams;
    return <div>
        <h1>Article Layout</h1>
        <p>Current Article Id: {articleId}</p>
        {/* <p>Current Language: {lang}</p> */}
        {children}
    </div>;
}

//client side example

// "use client";
// import { useParams, useSearchParams } from "next/navigation";

// export default function ArticleLayout({ children }: { children: React.ReactNode }) {
//     const params = useParams();
//     const searchParams = useSearchParams();
//     const articleId = params.articleId;
//     const lang = searchParams.get("lang") || "en";
    
//     return <div>
//         <h1>Article Layout</h1>
//         <p>Current Article Id: {articleId}</p>
//         <p>Current Language: {lang}</p>
//         {children}
//     </div>;
// }