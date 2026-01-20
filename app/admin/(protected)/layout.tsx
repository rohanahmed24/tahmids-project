"use client";

import { useState } from "react";
import { AdminSidebar, NavItem } from "@/app/admin/components/AdminSidebar";
import { LayoutDashboard, PenTool, Image, Users, BarChart3, Settings, Upload } from "lucide-react";
import { logoutAdmin } from "@/actions/admin-auth";
import { Menu } from "lucide-react";

const NAV_ITEMS: NavItem[] = [
    { id: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/admin/write", label: "Write", icon: PenTool },
    { id: "/admin/media", label: "Media", icon: Image },
    { id: "/admin/users", label: "Users", icon: Users },
    { id: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { id: "/admin/import", label: "Import", icon: Upload },
    { id: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logoutAdmin();
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex">
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navItems={NAV_ITEMS}
                handleLogout={handleLogout}
                siteName="The Wisdomia"
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
                {/* Mobile Header for Sidebar Toggle */}
                <div className="lg:hidden p-4 border-b border-border-primary bg-bg-secondary flex items-center justify-between sticky top-0 z-30">
                    <h1 className="font-bold text-lg">Admin Panel</h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -mr-2 text-text-secondary hover:text-text-primary"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
