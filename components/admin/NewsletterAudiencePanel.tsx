"use client";

import { useState } from "react";
import { Copy, Download, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import type { NewsletterSubscriberRecord } from "@/lib/newsletter";

interface AudienceUser {
  email: string;
  name: string;
  createdAt?: string;
}

interface NewsletterAudiencePanelProps {
  subscribers: NewsletterSubscriberRecord[];
  registeredUsers: AudienceUser[];
}

interface AudienceRow {
  email: string;
  segment: string;
  source: string;
  subscribedAt: string;
}

const sourceLabels: Record<string, string> = {
  "article-inline": "Article intro",
  "article-footer": "Article footer",
  "legacy-import": "Legacy import",
  site: "Site signup",
};

function formatSource(source: string | null) {
  if (!source) return "Site signup";
  return sourceLabels[source] || source.replace(/-/g, " ");
}

function buildAudienceRows(
  subscribers: NewsletterSubscriberRecord[],
  registeredUsers: AudienceUser[],
) {
  const audienceMap = new Map<string, AudienceRow>();

  for (const user of registeredUsers) {
    const normalizedEmail = user.email.trim().toLowerCase();
    if (!normalizedEmail) continue;

    audienceMap.set(normalizedEmail, {
      email: normalizedEmail,
      segment: "registered-user",
      source: "Registered user",
      subscribedAt: user.createdAt || "",
    });
  }

  for (const subscriber of subscribers) {
    const normalizedEmail = subscriber.email.trim().toLowerCase();
    if (!normalizedEmail) continue;

    const existing = audienceMap.get(normalizedEmail);
    audienceMap.set(normalizedEmail, {
      email: normalizedEmail,
      segment: existing ? "registered-user + subscriber" : "subscriber",
      source: formatSource(subscriber.source),
      subscribedAt: subscriber.createdAt,
    });
  }

  return Array.from(audienceMap.values()).sort((left, right) =>
    left.email.localeCompare(right.email),
  );
}

function downloadCsv(rows: AudienceRow[]) {
  const header = ["email", "segment", "source", "date"];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const csv = [
    header,
    ...rows.map((row) => [
      row.email,
      row.segment,
      row.source,
      row.subscribedAt,
    ]),
  ]
    .map((columns) => columns.map((column) => escape(column || "")).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "newsletter-audience.csv";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function NewsletterAudiencePanel({
  subscribers,
  registeredUsers,
}: NewsletterAudiencePanelProps) {
  const [copiedType, setCopiedType] = useState<
    "subscribers" | "audience" | null
  >(null);

  const newsletterEmails = subscribers.map((subscriber) => subscriber.email);
  const audienceRows = buildAudienceRows(subscribers, registeredUsers);
  const uniqueAudienceEmails = audienceRows.map((row) => row.email);

  const handleCopy = async (type: "subscribers" | "audience") => {
    const emails =
      type === "subscribers" ? newsletterEmails : uniqueAudienceEmails;

    if (emails.length === 0) {
      toast.error("No emails available to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopiedType(type);
      toast.success(
        type === "subscribers"
          ? "Newsletter subscriber emails copied."
          : "Full audience list copied.",
      );
      window.setTimeout(() => setCopiedType(null), 1800);
    } catch {
      toast.error("Clipboard copy failed.");
    }
  };

  const handleExport = () => {
    if (audienceRows.length === 0) {
      toast.error("No emails available to export.");
      return;
    }

    downloadCsv(audienceRows);
    toast.success("Audience CSV downloaded.");
  };

  return (
    <section className="bg-bg-secondary rounded-xl sm:rounded-2xl border border-border-primary overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 md:p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-primary">
              <Mail className="h-3.5 w-3.5" />
              <span>Newsletter Audience</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                Subscriber emails and bulk-send exports
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Direct newsletter signups are listed below. Bulk actions include
                both signups and registered user emails.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-border-primary bg-bg-primary/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-text-tertiary">
                Subscribers
              </p>
              <p className="mt-1 text-lg font-semibold text-text-primary">
                {subscribers.length}
              </p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-primary/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-text-tertiary">
                Users
              </p>
              <p className="mt-1 text-lg font-semibold text-text-primary">
                {registeredUsers.length}
              </p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-primary/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-text-tertiary">
                Unique
              </p>
              <p className="mt-1 text-lg font-semibold text-text-primary">
                {uniqueAudienceEmails.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => handleCopy("subscribers")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-primary px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Copy className="h-4 w-4" />
            <span>
              {copiedType === "subscribers" ? "Copied" : "Copy subscribers"}
            </span>
          </button>
          <button
            onClick={() => handleCopy("audience")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-primary/90"
          >
            <Users className="h-4 w-4 text-black" />
            <span className="text-black">
              {copiedType === "audience" ? "Copied" : "Copy full audience"}
            </span>
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-primary px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="max-h-[28rem] overflow-y-auto">
        {subscribers.length === 0 ? (
          <div className="px-4 py-10 text-center sm:px-6">
            <Mail className="mx-auto h-10 w-10 text-text-tertiary" />
            <h3 className="mt-3 text-base font-semibold text-text-primary">
              No newsletter signups yet
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              The export actions will still work with registered user emails
              once accounts exist.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-bg-secondary">
                  <tr className="border-b border-border-primary">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Locale
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-secondary">
                      Subscribed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((subscriber) => (
                    <tr
                      key={subscriber.id}
                      className="border-b border-border-primary/70 hover:bg-bg-tertiary/30"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-text-primary">
                        {subscriber.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {formatSource(subscriber.source)}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary uppercase">
                        {subscriber.locale || "en"}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {new Date(subscriber.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-border-primary md:hidden">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="px-4 py-4">
                  <p className="text-sm font-medium text-text-primary break-all">
                    {subscriber.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                    <span className="rounded-full bg-bg-primary px-2 py-1">
                      {formatSource(subscriber.source)}
                    </span>
                    <span className="rounded-full bg-bg-primary px-2 py-1 uppercase">
                      {subscriber.locale || "en"}
                    </span>
                    <span>
                      {new Date(subscriber.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
