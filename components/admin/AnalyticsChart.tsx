"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  Eye,
  BarChart3,
  FileText,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Post } from "@/lib/posts";
import { motion } from "framer-motion";

interface AnalyticsChartProps {
  posts: Post[];
  userCount: number;
}

export function AnalyticsChart({ posts, userCount }: AnalyticsChartProps) {
  const insightCardStyle = {
    background:
      "linear-gradient(145deg, color-mix(in srgb, var(--bg-card) 94%, transparent), color-mix(in srgb, var(--bg-tertiary) 28%, var(--bg-card) 72%))",
  } as const;

  const primaryTextStyle = {
    color: "var(--text-primary)",
  } as const;

  const secondaryTextStyle = {
    color: "var(--text-secondary)",
  } as const;

  const tertiaryTextStyle = {
    color: "var(--text-muted)",
  } as const;

  const primaryValueStyle = {
    color: "var(--text-primary)",
  } as const;

  const healthValueStyle = {
    color: "color-mix(in srgb, #10b981 76%, var(--text-primary) 24%)",
  } as const;

  // Calculate real stats
  const totalViews = useMemo(
    () => posts.reduce((sum, post) => sum + (post.views || 0), 0),
    [posts],
  );
  const totalArticles = posts.length;
  const avgViews =
    totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

  // Top 5 posts by views
  const topPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [posts]);

  // Calculate max views for bar scale
  const maxViews = topPosts.length > 0 ? topPosts[0].views || 1 : 100;

  const metrics = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      iconColor: "text-emerald-700 dark:text-emerald-300",
      iconBg: "bg-emerald-500/12 dark:bg-emerald-400/12",
      borderColor: "border-emerald-300/45 dark:border-emerald-400/25",
      surfaceColor:
        "bg-gradient-to-br from-emerald-500/8 via-bg-card to-bg-card dark:from-emerald-400/10 dark:via-bg-card dark:to-bg-card",
      valueColor: "text-emerald-800 dark:text-emerald-200",
    },
    {
      label: "Total Articles",
      value: totalArticles.toLocaleString(),
      icon: FileText,
      iconColor: "text-sky-700 dark:text-sky-300",
      iconBg: "bg-sky-500/12 dark:bg-sky-400/12",
      borderColor: "border-sky-300/45 dark:border-sky-400/25",
      surfaceColor:
        "bg-gradient-to-br from-sky-500/8 via-bg-card to-bg-card dark:from-sky-400/10 dark:via-bg-card dark:to-bg-card",
      valueColor: "text-sky-800 dark:text-sky-200",
    },
    {
      label: "Avg. Views",
      value: avgViews.toLocaleString(),
      icon: TrendingUp,
      iconColor: "text-violet-700 dark:text-violet-300",
      iconBg: "bg-violet-500/12 dark:bg-violet-400/12",
      borderColor: "border-violet-300/45 dark:border-violet-400/25",
      surfaceColor:
        "bg-gradient-to-br from-violet-500/8 via-bg-card to-bg-card dark:from-violet-400/10 dark:via-bg-card dark:to-bg-card",
      valueColor: "text-violet-800 dark:text-violet-200",
    },
  ];

  return (
    <div className="bg-bg-secondary rounded-xl sm:rounded-2xl border border-border-primary overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-accent-primary/10">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary" />
            </div>
            <div>
              <h2
                className="text-base sm:text-lg md:text-xl font-semibold"
                style={primaryTextStyle}
              >
                Content Performance
              </h2>
              <p
                className="hidden text-[10px] sm:block sm:text-xs"
                style={tertiaryTextStyle}
              >
                Top performing articles by views
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs" style={tertiaryTextStyle}>
            <span className="hidden sm:inline">All time</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6 md:space-y-8">
        {/* Key Metrics - Horizontal scroll on mobile */}
        <div
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar
                    sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`min-w-[140px] sm:min-w-0 snap-start flex-1 rounded-xl border p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:rounded-2xl sm:p-4 ${metric.borderColor} ${metric.surfaceColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p
                    className="text-[10px] font-medium uppercase tracking-wide sm:text-xs"
                    style={secondaryTextStyle}
                  >
                    {metric.label}
                  </p>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 ${metric.iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                  </div>
                </div>
                <p
                  className={`text-xl font-bold tracking-tight sm:text-2xl md:text-3xl ${metric.valueColor}`}
                >
                  {metric.value}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Top Content Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm sm:text-base md:text-lg font-semibold"
              style={primaryTextStyle}
            >
              Top 5 Trending Articles
            </h3>
            {topPosts.length > 0 && (
              <span className="text-[10px] sm:text-xs" style={tertiaryTextStyle}>
                Click to view
              </span>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-border-primary/60 bg-bg-card/50 p-3 sm:p-4">
            {topPosts.map((post, index) => {
              const widthPercent = Math.max(
                ((post.views || 0) / maxViews) * 100,
                3,
              );
              const barColors = [
                "from-sky-500 to-blue-600 dark:from-sky-400 dark:to-blue-500",
                "from-violet-500 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-500",
                "from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500",
                "from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500",
                "from-rose-500 to-pink-600 dark:from-rose-400 dark:to-pink-500",
              ];

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group cursor-pointer rounded-xl px-2 py-2 transition-colors hover:bg-bg-tertiary/35"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-primary/60 bg-bg-secondary text-[10px] font-bold text-text-secondary sm:h-6 sm:w-6 sm:text-xs">
                        {index + 1}
                      </span>
                      <span
                        className="font-medium truncate transition-colors group-hover:text-accent-primary"
                        style={primaryTextStyle}
                      >
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <span className="font-medium" style={secondaryTextStyle}>
                        {(post.views || 0).toLocaleString()}
                      </span>
                      <ArrowUpRight
                        className="w-3 h-3 opacity-0 transition-opacity group-hover:opacity-100"
                        style={tertiaryTextStyle}
                      />
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full border border-border-primary/40 bg-bg-tertiary/80 sm:h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + index * 0.1,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${barColors[index]} shadow-[0_0_18px_rgba(59,130,246,0.15)] transition-shadow group-hover:shadow-[0_0_24px_rgba(59,130,246,0.28)]`}
                    />
                  </div>
                </motion.div>
              );
            })}

            {topPosts.length === 0 && (
              <div className="text-center py-8 sm:py-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-text-tertiary" />
                </div>
                <p className="text-sm font-medium" style={secondaryTextStyle}>
                  No articles yet
                </p>
                <p className="mt-1 text-xs" style={tertiaryTextStyle}>
                  Create your first article to see analytics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Audience Insights - Responsive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            className="rounded-xl border border-border-primary/60 p-4 shadow-sm sm:rounded-2xl"
            style={insightCardStyle}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-accent-primary" />
              <h4 className="text-sm font-medium" style={primaryTextStyle}>
                Audience Insights
              </h4>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm" style={secondaryTextStyle}>
                  Registered Users
                </span>
                <span
                  className="font-semibold text-sm sm:text-base"
                  style={primaryValueStyle}
                >
                  {userCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm" style={secondaryTextStyle}>
                  Conversion Rate
                </span>
                <span
                  className="font-semibold text-sm sm:text-base"
                  style={primaryValueStyle}
                >
                  {totalViews > 0
                    ? ((userCount / totalViews) * 100).toFixed(2)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl border border-border-primary/60 p-4 shadow-sm sm:rounded-2xl"
            style={insightCardStyle}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-sm font-medium" style={primaryTextStyle}>
                Performance
              </h4>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm" style={secondaryTextStyle}>
                  Views per User
                </span>
                <span
                  className="font-semibold text-sm sm:text-base"
                  style={primaryValueStyle}
                >
                  {userCount > 0 ? (totalViews / userCount).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm" style={secondaryTextStyle}>
                  Content Health
                </span>
                <span
                  className="flex items-center gap-1 text-sm font-semibold sm:text-base"
                  style={healthValueStyle}
                >
                  Good
                  <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
