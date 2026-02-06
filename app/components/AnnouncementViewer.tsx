"use client";

import { useMemo, useState, useEffect } from "react";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useCategories } from "../hooks/useCategories";
import CategoryTabs from "./CategoryTabs";

export default function AnnouncementViewer() {
  const { announcements, isLoaded: announcementsLoaded } = useAnnouncements();
  const { categories, isLoaded: categoriesLoaded } = useCategories();
  
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );
  
  const [activeCategoryId, setActiveCategoryId] = useState("");

  // Set initial category once loaded
  useEffect(() => {
    if (categoriesLoaded && sortedCategories.length > 0 && !activeCategoryId) {
       setActiveCategoryId(sortedCategories[0].id);
    }
  }, [categoriesLoaded, sortedCategories, activeCategoryId]);

  const activeAnnouncements = useMemo(() => {
    return announcements.filter(
      (announcement) => announcement.active && announcement.categoryId === activeCategoryId
    );
  }, [activeCategoryId, announcements]);

  if (!announcementsLoaded || !categoriesLoaded) {
    return <div className="p-8 text-center text-white/50">Loading...</div>;
  }

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
            {/* Handle both string[] (legacy/static) and string (HTML from editor) content */}
            <div className="mt-3 text-base leading-relaxed text-white/90">
              {announcement.content.map((paragraph, index) => (
                 <div 
                    key={`${announcement.id}-${index}`} 
                    className="prose prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0" 
                    dangerouslySetInnerHTML={{ __html: paragraph }} 
                 />
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
