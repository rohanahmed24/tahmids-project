import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { verifyAdmin } from "@/actions/admin-auth";
import { getAllUsers, getUserStats } from "@/lib/users";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserPlus, Users, Shield, Clock, Search, Filter } from "lucide-react";

export default async function UsersPage() {
    const session = await auth();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    const [users, userStats] = await Promise.all([
        getAllUsers(),
        getUserStats()
    ]);

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
                        <p className="text-text-secondary mt-2">Manage user accounts and permissions</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors">
                            <Filter className="w-4 h-4 inline mr-2" />
                            Filter
                        </button>
                        <button className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors">
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{userStats.totalUsers}</p>
                                <p className="text-text-secondary text-sm">Total Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <Shield className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{userStats.adminUsers}</p>
                                <p className="text-text-secondary text-sm">Administrators</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Clock className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{userStats.recentUsers}</p>
                                <p className="text-text-secondary text-sm">New This Month</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">{userStats.activeUsers}</p>
                                <p className="text-text-secondary text-sm">Active Users</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or role..."
                                className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            />
                        </div>
                        <select className="px-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                            <option value="all">All Roles</option>
                            <option value="admin">Administrators</option>
                            <option value="user">Regular Users</option>
                        </select>
                        <select className="px-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary">
                    <div className="p-6 border-b border-border-primary">
                        <h2 className="text-xl font-semibold text-text-primary">All Users</h2>
                    </div>
                    <Suspense fallback={<div className="h-96 bg-bg-secondary rounded-xl animate-pulse" />}>
                        <UsersTable users={users} />
                    </Suspense>
                </div>

                {/* User Activity Timeline */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Recent User Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-bg-tertiary rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-text-primary font-medium">New user registration</p>
                                <p className="text-text-secondary text-sm">john.doe@example.com joined the platform</p>
                            </div>
                            <span className="text-text-tertiary text-sm">2 hours ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-bg-tertiary rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-text-primary font-medium">Role updated</p>
                                <p className="text-text-secondary text-sm">sarah.wilson@example.com promoted to admin</p>
                            </div>
                            <span className="text-text-tertiary text-sm">5 hours ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-bg-tertiary rounded-lg">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-text-primary font-medium">Profile updated</p>
                                <p className="text-text-secondary text-sm">mike.johnson@example.com updated their profile</p>
                            </div>
                            <span className="text-text-tertiary text-sm">1 day ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-bg-tertiary rounded-lg">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-text-primary font-medium">Password reset</p>
                                <p className="text-text-secondary text-sm">emma.davis@example.com requested password reset</p>
                            </div>
                            <span className="text-text-tertiary text-sm">2 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}