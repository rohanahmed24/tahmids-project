import { Loader2 } from "lucide-react";

export function PageLoading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-6">
      <div className="relative rounded-2xl border border-border-primary bg-bg-card/80 px-8 py-7 shadow-xl backdrop-blur-md">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-blue-500/10" />
        <div className="relative z-10 flex items-center gap-3 text-text-primary">
          <Loader2 className="h-5 w-5 animate-spin text-accent-main" />
          <span className="text-sm font-semibold tracking-wide">
            Loading…
          </span>
        </div>
      </div>
    </div>
  );
}
