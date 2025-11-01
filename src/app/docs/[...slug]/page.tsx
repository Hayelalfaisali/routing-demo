export default async function Docs({ params }: { params: { slug: string[] } }) {
    const { slug } = await params;
    if (slug?.length === 2) {
        return (
            <>
                <h1>Docs </h1>
                <p>Slug: {slug[0]}</p>
                <p>Chapter: {slug[1]}</p>
            </>
        );
    }
    if (slug?.length === 1) {
        return (
            <>
                <h1>Docs </h1>
                <p>Slug: {slug[0]}</p>
            </>
        );
    }
    if (slug?.length === 3) {
        return (
            <>
                <h1>Docs </h1>
                <p>Slug: {slug[0]}</p>
                <p>Chapter: {slug[1]}</p>
                <p>Section: {slug[2]}</p>
            </>
        );
    }
}