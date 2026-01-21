"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";

interface VerificationStatusIndicatorProps {
    status: "verified" | "pending" | "not_verified";
    lastCheck: string | null;
}

export default function VerificationStatusIndicator({
    status,
    lastCheck
}: VerificationStatusIndicatorProps) {
    const statusConfig = {
        verified: {
            icon: CheckCircle,
            label: "Verified",
            description: "Your site is verified with Google",
            bgColor: "bg-green-500/10",
            iconColor: "text-green-500",
            borderColor: "border-green-500/20",
            pulseColor: "bg-green-500"
        },
        pending: {
            icon: Clock,
            label: "Pending",
            description: "Awaiting Google verification",
            bgColor: "bg-amber-500/10",
            iconColor: "text-amber-500",
            borderColor: "border-amber-500/20",
            pulseColor: "bg-amber-500"
        },
        not_verified: {
            icon: XCircle,
            label: "Not Verified",
            description: "Add your verification tag below",
            bgColor: "bg-red-500/10",
            iconColor: "text-red-500",
            borderColor: "border-red-500/20",
            pulseColor: "bg-red-500"
        }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    const formatLastCheck = (timestamp: string | null) => {
        if (!timestamp) return null;
        try {
            const date = new Date(timestamp);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return null;
        }
    };

    return (
        <div className={`bg-bg-secondary rounded-xl border ${config.borderColor} p-6`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 ${config.bgColor} rounded-lg relative`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                    {status === "pending" && (
                        <span className="absolute -top-1 -right-1 w-3 h-3">
                            <span className={`absolute inline-flex h-full w-full rounded-full
                                ${config.pulseColor} opacity-75 animate-ping`} />
                            <span className={`relative inline-flex rounded-full h-3 w-3
                                ${config.pulseColor}`} />
                        </span>
                    )}
                </div>
                <h3 className="font-medium text-text-primary">Verification Status</h3>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${config.iconColor}`}>
                        {config.label}
                    </span>
                </div>
                <p className="text-sm text-text-secondary">
                    {config.description}
                </p>
                {lastCheck && (
                    <p className="text-xs text-text-tertiary mt-2">
                        Last updated: {formatLastCheck(lastCheck)}
                    </p>
                )}
            </div>
        </div>
    );
}
