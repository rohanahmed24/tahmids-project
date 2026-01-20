"use client";

import { User } from "@/lib/users";
import { Shield } from "lucide-react";
import Link from "next/link";

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
    return (
        <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-bg-secondary">
                        <tr className="border-b border-border-primary">
                            <th className="text-left p-4 text-text-secondary font-medium">User</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Role</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Articles</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.slice(0, 10).map((user) => (
                            <tr key={user.id} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-text-primary">
                                                {user.name}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'
                                            }`} />
                                        <span className={`text-sm capitalize ${user.role === 'admin' ? 'text-red-600' : 'text-blue-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-text-secondary">
                                        {user.article_count || 0}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-text-secondary text-sm">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length > 10 && (
                <div className="p-4 text-center border-t border-border-primary">
                    <Link href="/admin/users" className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium">
                        View All Users ({users.length})
                    </Link>
                </div>
            )}
        </div>
    );
}