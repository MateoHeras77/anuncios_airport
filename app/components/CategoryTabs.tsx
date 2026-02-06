"use client";

import { Category } from "../data/announcements";

type CategoryTabsProps = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
};

export default function CategoryTabs({ categories, activeId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-accent text-night"
                : "bg-sky text-white hover:bg-[#2e3b5e]"
            }`}
            aria-pressed={isActive}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
