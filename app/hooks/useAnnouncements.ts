"use client";

import { useState, useEffect } from "react";
import { Announcement } from "../data/announcements";
import { supabase } from "../lib/supabase";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching announcements:", error);
    } else {
      // Map snake_case DB fields to camelCase TS type
      const mapped = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        categoryId: item.category_id,
        active: item.active,
      }));
      setAnnouncements(mapped);
    }
    setIsLoaded(true);
  };

  const addAnnouncement = async (announcement: Announcement) => {
    const dbPayload = {
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      category_id: announcement.categoryId,
      active: announcement.active,
      order: announcements.length + 1, // Add at end
    };

    const { error } = await supabase.from("announcements").insert([dbPayload]);

    if (error) {
      console.error("Error adding announcement:", error);
      alert("Failed to save announcement");
    } else {
      setAnnouncements((prev) => [...prev, announcement]);
    }
  };

  const updateAnnouncement = async (announcement: Announcement) => {
    const dbPayload = {
      title: announcement.title,
      content: announcement.content,
      category_id: announcement.categoryId,
      active: announcement.active,
    };

    const { error } = await supabase
      .from("announcements")
      .update(dbPayload)
      .eq("id", announcement.id);

    if (error) {
      console.error("Error updating announcement:", error);
      alert("Failed to update announcement");
    } else {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === announcement.id ? announcement : a))
      );
    }
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    } else {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const reorderAnnouncements = async (newOrder: Announcement[]) => {
    // Optimistic update
    setAnnouncements(newOrder);

    // Prepare updates for DB
    // We only need to update the 'order' field for each item
    const updates = newOrder.map((item, index) => ({
      id: item.id,
      title: item.title, // Include required fields if upserting, or just PK for update
      content: item.content,
      category_id: item.categoryId,
      active: item.active,
      order: index,
    }));

    // Using upsert to update multiple rows in one go (requires all non-null fields usually, or specific handling)
    // Simpler approach: Promise.all with updates. For < 50 items it's fine.
    // Better approach: Upsert. Assuming 'id' is PK.
    
    const { error } = await supabase.from("announcements").upsert(updates);

    if (error) {
      console.error("Error reordering announcements:", error);
      // Revert if failed (optional, but good practice)
      fetchAnnouncements();
    }
  };

  // Reset to defaults (Removed for Supabase version, or could implement a 'seed' function)
  const resetAnnouncements = () => {
     alert("Reset not supported in cloud mode.");
  };

  return {
    announcements,
    isLoaded,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    reorderAnnouncements,
    resetAnnouncements
  };
}
