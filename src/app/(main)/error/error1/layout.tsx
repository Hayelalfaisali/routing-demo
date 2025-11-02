const getRandomInit = (max: number) => {
    return Math.floor(Math.random() * max);
}

export default function ErrorLayout({ children }: { children: React.ReactNode }) {
    const random = getRandomInit(2);
    if (random === 1) {
        throw new Error("Error in layout of page 1");
    }
    return <div>
    <footer>Error hierarchy example</footer>
        {children}
    </div>;
}