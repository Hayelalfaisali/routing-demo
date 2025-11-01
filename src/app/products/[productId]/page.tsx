export default async function Product({ params }: { params: { productId: string } }) {
    const { productId } = await params;
    return (
        <>
            <h1>Product details for {productId}</h1>
        </>
    );
}