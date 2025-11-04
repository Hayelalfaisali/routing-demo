export default function ComplexDashboardLayout({ children, users, revenue, notifications, login }: { children: React.ReactNode, users: React.ReactNode, revenue: React.ReactNode, notifications: React.ReactNode, login: React.ReactNode }) {

     const isAuthenticated = false;
    return isAuthenticated ? <div>
        <header>Complex Dashboard</header>
        {children}
        <div className="flex  gap-4">
            <div className="flex-1 h-full flex flex-col gap-4 w-full">
                <div className="flex-1">{users}</div>
                <div className="flex-1">{revenue}</div>
            </div>
            <div className="flex-1 h-full">{notifications}</div>
        </div>
    </div> : login;
}