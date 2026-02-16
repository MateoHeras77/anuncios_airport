"use client";

import { useState, useEffect } from "react";
import { Category } from "../data/announcements";
import { supabase } from "../lib/supabase";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
    setIsLoaded(true);
  };

  const addCategory = async (label: string) => {
    // Generate ID from label
    const id = label
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newCategory = {
      id,
      label,
      order: categories.length, // Add to end
    };
    
    // ... existing insert code ...
    const { error } = await supabase.from("categories").insert([newCategory]);

    if (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
      return null;
    } else {
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    }
  };

  const updateCategory = async (id: string, label: string) => {
    const { error } = await supabase
      .from("categories")
      .update({ label })
      .eq("id", id);

    if (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category");
    } else {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, label } : c))
      );
    }
  };

  const reorderCategories = async (newOrder: Category[]) => {
    const updates = newOrder.map((cat, index) => ({
      ...cat,
      order: index,
    }));
    
    // Optimistic
    setCategories(updates);

    const { error } = await supabase.from("categories").upsert(updates);
    
    if (error) {
       console.log("Error reordering categories", error)
    }
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    reorderCategories,
    deleteCategory,
  };
}
