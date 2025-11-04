import Link from "next/link";

export default function F1Page() {
    return <div>F1 Page
        <Link className="text-blue-500 ms-2" href="/f1/f2">move to F2 </Link>
        <Link className="text-blue-500 ms-2" href="/f3">move to F3 </Link>
    </div>;
}