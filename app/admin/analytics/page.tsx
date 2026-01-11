import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { verifyAdmin } from "@/actions/admin-auth";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { TrendingUp, Users, Eye, Clock, Globe, Smartphone, Monitor, Tablet } from "lucide-react";

export default async function AnalyticsPage() {
    const session = await auth();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Analytics Dashboard</h1>
                        <p className="text-text-secondary mt-2">Track your content performance and audience insights</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <select className="px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary">
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        <button className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors">
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Total Views</p>
                                <p className="text-3xl font-bold text-text-primary">12,847</p>
                                <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+12.5% from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Eye className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Unique Visitors</p>
                                <p className="text-3xl font-bold text-text-primary">3,421</p>
                                <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+8.2% from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Avg. Session Duration</p>
                                <p className="text-3xl font-bold text-text-primary">4:32</p>
                                <div className="flex items-center gap-1 text-green-500 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+15.3% from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <Clock className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Bounce Rate</p>
                                <p className="text-3xl font-bold text-text-primary">32.1%</p>
                                <div className="flex items-center gap-1 text-red-500 text-sm mt-2">
                                    <TrendingUp className="w-4 h-4 rotate-180" />
                                    <span>-2.1% from last month</span>
                                </div>
                            </div>
                            <div className="p-3 bg-orange-500/10 rounded-lg">
                                <Globe className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Analytics Chart */}
                <Suspense fallback={<div className="h-96 bg-bg-secondary rounded-xl animate-pulse" />}>
                    <AnalyticsChart />
                </Suspense>

                {/* Additional Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Device Analytics */}
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-6">Device Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-blue-500" />
                                    <span className="text-text-primary">Desktop</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-bg-tertiary rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                    <span className="text-text-secondary text-sm w-12">65%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-green-500" />
                                    <span className="text-text-primary">Mobile</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-bg-tertiary rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                                    </div>
                                    <span className="text-text-secondary text-sm w-12">28%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Tablet className="w-5 h-5 text-purple-500" />
                                    <span className="text-text-primary">Tablet</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-bg-tertiary rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                                    </div>
                                    <span className="text-text-secondary text-sm w-12">7%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Geographic Analytics */}
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <h3 className="text-xl font-semibold text-text-primary mb-6">Top Countries</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">US</div>
                                    <span className="text-text-primary">United States</span>
                                </div>
                                <span className="text-text-secondary">2,847 visits</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">CA</div>
                                    <span className="text-text-primary">Canada</span>
                                </div>
                                <span className="text-text-secondary">1,234 visits</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-4 bg-green-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">UK</div>
                                    <span className="text-text-primary">United Kingdom</span>
                                </div>
                                <span className="text-text-secondary">987 visits</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-4 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">DE</div>
                                    <span className="text-text-primary">Germany</span>
                                </div>
                                <span className="text-text-secondary">756 visits</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-4 bg-purple-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">AU</div>
                                    <span className="text-text-primary">Australia</span>
                                </div>
                                <span className="text-text-secondary">543 visits</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}