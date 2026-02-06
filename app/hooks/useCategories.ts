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
    const newCategory: Category = {
      id: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      order: categories.length + 1,
    };

    const { error } = await supabase.from("categories").insert([newCategory]);

    if (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    } else {
      setCategories((prev) => [...prev, newCategory]);
    }
    return newCategory;
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
    deleteCategory,
  };
}
