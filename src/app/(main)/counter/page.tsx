import Counter from "./counter";
import { Metadata } from "next";

 export const metadata: Metadata = {
    title: "Counter",
    description: "Counter page",
}
export default function CounterPage() {
    return <Counter />;
}