import Link from "next/link";

export default function ArticlesPage() {
    return (
      <div>
        <h1>Articles Page</h1>
        <ul>
          <li><Link href="/articles/breaking-news-123?lang=en">Article en</Link></li>
          <li><Link href="/articles/breaking-news-123?lang=es">Article Es</Link></li>
          <li><Link href="/articles/breaking-news-123?lang=fr">Article fr</Link></li>
        </ul>
      </div>
    );
  }