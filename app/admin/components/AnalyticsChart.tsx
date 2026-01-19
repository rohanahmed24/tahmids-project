"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { useState } from "react";

// Define flexible data item for reusability
export interface AnalyticsDataItem {
    name?: string;
    month?: string;
    users?: number;
    views?: number;
    [key: string]: string | number | undefined;
}

interface AnalyticsChartProps {
    data: AnalyticsDataItem[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
    const [timeRange, setTimeRange] = useState("30d");
    const [activeTab, setActiveTab] = useState("growth");

    // Map data to chart format
    const chartData = data.length > 0 ? data.map(item => ({
        name: item.month || item.name,
        users: item.users || 0,
        views: item.views || 0
    })) : [
        { name: "Jan", users: 400, views: 2400 },
        { name: "Feb", users: 300, views: 1398 },
        { name: "Mar", users: 200, views: 9800 },
        { name: "Apr", users: 278, views: 3908 },
        { name: "May", users: 189, views: 4800 },
        { name: "Jun", users: 239, views: 3800 },
        { name: "Jul", users: 349, views: 4300 },
    ];

    return (

        <div className="col-span-4 bg-bg-card border border-border-primary rounded-2xl p-6">
            <div className="flex flex-row items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-text-primary">Analytics Overview</h3>
                    <p className="text-sm text-text-secondary">
                        User growth and content engagement over time.
                    </p>
                </div>
                <div className="flex bg-bg-tertiary border-border-primary rounded-lg p-1">
                    {["7d", "30d", "all"].map((val) => (
                        <button
                            key={val}
                            onClick={() => setTimeRange(val)}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${timeRange === val ? "bg-accent-main text-white" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            {val === "all" ? "All Time" : val === "7d" ? "7 Days" : "30 Days"}
                        </button>
                    ))}
                </div>
            </div>
            <div className="pl-2">
                <div className="space-y-4">
                    <div className="flex bg-bg-tertiary border-border-primary rounded-lg p-1 w-fit">
                        <button
                            onClick={() => setActiveTab("growth")}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "growth" ? "bg-accent-main text-white" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            User Growth
                        </button>
                        <button
                            onClick={() => setActiveTab("views")}
                            className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === "views" ? "bg-accent-main text-white" : "text-text-secondary hover:text-text-primary"}`}
                        >
                            Article Views
                        </button>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {activeTab === "growth" ? (
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#8884d8"
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                    />
                                </AreaChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                    <Tooltip
                                        cursor={{ fill: '#374151' }}
                                        contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                    <Bar dataKey="views" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
