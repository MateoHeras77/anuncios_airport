"use client";

import { useState, useEffect } from "react";
import { Announcement, announcements as defaultAnnouncements } from "../data/announcements";

const STORAGE_KEY = "airport_announcements_v1";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAnnouncements(JSON.parse(stored));
      } else {
        // Initialize with default data if storage is empty
        setAnnouncements(defaultAnnouncements);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAnnouncements));
      }
    } catch (e) {
      console.error("Failed to load announcements", e);
      setAnnouncements(defaultAnnouncements);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnnouncements));
  };

  const addAnnouncement = (announcement: Announcement) => {
    const updated = [...announcements, announcement];
    saveAnnouncements(updated);
  };

  const updateAnnouncement = (announcement: Announcement) => {
    const updated = announcements.map((a) =>
      a.id === announcement.id ? announcement : a
    );
    saveAnnouncements(updated);
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    saveAnnouncements(updated);
  };

  // Reset to defaults (useful for testing)
  const resetAnnouncements = () => {
    setAnnouncements(defaultAnnouncements);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAnnouncements));
  };

  return {
    announcements,
    isLoaded,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    resetAnnouncements
  };
}
