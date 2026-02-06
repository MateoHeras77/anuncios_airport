"use client";

import { useState, useEffect } from "react";
import { Category, categories as defaultCategories } from "../data/announcements";

const CATEGORIES_STORAGE_KEY = "airport_categories_v1";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
      }
    } catch (e) {
      console.error("Failed to load categories", e);
      setCategories(defaultCategories);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
  };

  const addCategory = (label: string) => {
    const newCategory: Category = {
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      order: categories.length + 1
    };
    saveCategories([...categories, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
  };

  return {
    categories,
    isLoaded,
    addCategory,
    deleteCategory
  };
}
