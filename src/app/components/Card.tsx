export default function Card({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded justify-center items-center m-2 shadow-lg" >
        {children}
    </div>;
}