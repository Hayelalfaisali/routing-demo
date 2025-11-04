import Card from "@/src/app/components/Card";
import Link from "next/link";

export default function NotificationsPage() {
    return <Card>Notifications Page
        <Link href="/complex-dashboard/archived">archived </Link>
    </Card>;
}