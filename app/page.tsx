import Link from "next/link";
import AnnouncementViewer from "./components/AnnouncementViewer";
import { lastUpdatedAt } from "./data/metadata";

export default function HomePage() {
  return (
    <main className="bg-night">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-10">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">Airport Announcements</h1>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
                Viewer mode
              </span>
              <Link
                href="/admin"
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                Editor
              </Link>
            </div>
          </div>
          <p className="max-w-3xl text-base text-white/80">
            Fast, offline-capable reference announcements for boarding, delays, arrivals, and
            safety. This tablet view stays available even without internet access.
          </p>
          <div className="text-xs text-white/60">
            Last updated at {new Date(lastUpdatedAt).toLocaleString()}
          </div>
        </header>
        <AnnouncementViewer />
      </div>
    </main>
  );
}
