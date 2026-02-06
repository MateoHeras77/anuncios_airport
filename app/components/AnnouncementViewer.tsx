"use client";

import { useMemo, useState } from "react";
import { announcements, categories } from "../data/announcements";
import CategoryTabs from "./CategoryTabs";

export default function AnnouncementViewer() {
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    []
  );
  const [activeCategoryId, setActiveCategoryId] = useState(sortedCategories[0]?.id ?? "");

  const activeAnnouncements = useMemo(() => {
    return announcements.filter(
      (announcement) => announcement.active && announcement.categoryId === activeCategoryId
    );
  }, [activeCategoryId]);

  return (
    <section className="space-y-6">
      <CategoryTabs
        categories={sortedCategories}
        activeId={activeCategoryId}
        onSelect={setActiveCategoryId}
      />
      <div className="space-y-6">
        {activeAnnouncements.map((announcement) => (
          <article
            key={announcement.id}
            className="rounded-2xl border border-white/10 bg-night/60 p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold text-white">{announcement.title}</h2>
            <div className="mt-3 space-y-3 text-base leading-relaxed text-white/90">
              {announcement.content.map((paragraph, index) => (
                <p key={`${announcement.id}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
        {activeAnnouncements.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-night/40 p-8 text-center text-white/70">
            No active announcements in this category.
          </div>
        )}
      </div>
    </section>
  );
}
