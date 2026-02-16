"use client";

import { useMemo, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { type Announcement } from "../data/announcements";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useCategories } from "../hooks/useCategories";

const toolbarButton =
  "rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10";

interface SortableCategoryItemProps {
  category: { id: string; label: string };
  onUpdate: (id: string, label: string) => void;
  onDelete: (id: string) => void;
}

function SortableCategoryItem({ category, onUpdate, onDelete }: SortableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative' as const,
  };
  
  const [localLabel, setLocalLabel] = useState(category.label);

  // Sync if prop changes externally
  useEffect(() => {
     setLocalLabel(category.label);
  }, [category.label]);

  const handleBlur = () => {
      if (localLabel !== category.label) {
          onUpdate(category.id, localLabel);
      }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 rounded bg-white/5 p-2 text-sm border border-white/5"
    >
      <button 
        className="cursor-move p-2 text-white/30 hover:text-white/70 active:text-white/90 touch-none select-none"
        {...attributes} 
        {...listeners}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <input 
        className="flex-1 bg-transparent px-2 py-1 text-white focus:bg-white/10 focus:outline-none rounded"
        value={localLabel}
        onChange={(e) => setLocalLabel(e.target.value)}
        onBlur={handleBlur}
      />
      <button 
        onClick={() => onDelete(category.id)} 
        className="p-2 text-red-500/50 hover:text-red-400"
        title="Delete Category"
      >
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
         </svg>
      </button>
    </div>
  );
}

interface SortableItemProps {
  id: string;
  announcement: Announcement;
  categories: { id: string; label: string }[];
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function SortableItem({ id, announcement, categories, isSelected, onSelect }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: 'relative' as const,
  };

  const categoryLabel = categories.find(c => c.id === announcement.categoryId)?.label;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center rounded text-sm transition-colors ${
        isSelected
          ? "bg-white/20 text-white font-medium"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {/* Drag Handle */}
      <button 
        className="cursor-move p-3 text-white/30 hover:text-white/70 active:text-white/90 touch-none select-none"
        {...attributes} 
        {...listeners}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <button
        onClick={() => onSelect(id)}
        className="flex-1 text-left py-2 pr-3 min-w-0"
      >
        <div className="truncate">{announcement.title}</div>
        <div className="text-[10px] text-white/40 uppercase">{categoryLabel}</div>
      </button>
    </div>
  );
}

export default function AdminPage() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, reorderAnnouncements } = useAnnouncements();
  const { categories, addCategory, updateCategory, reorderCategories, deleteCategory } = useCategories();
  
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // UI State: Toggle correct panel
  const [manageCategoriesMode, setManageCategoriesMode] = useState(false);

  // Filter state for the list
  const [listCategoryFilter, setListCategoryFilter] = useState<string>("all");

  // Form state
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const [title, setTitle] = useState("New announcement");
  const [isActive, setIsActive] = useState(true);

  // New Category prompt state (using simple prompt for now, or just implicit in add)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        listItem: false
      }),
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [2, 3] }),
      BulletList,
      ListItem
    ],
    content: "<p>Type the announcement content here.</p>"
  });

  const previewHTML = editor?.getHTML() ?? "";

  const previewCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategory),
    [selectedCategory, categories]
  );
  
  // Update state defaults when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === "") {
        setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const filteredAnnouncements = useMemo(() => {
    if (listCategoryFilter === "all") return announcements;
    return announcements.filter(a => a.categoryId === listCategoryFilter);
  }, [announcements, listCategoryFilter]);

  const handleCreateCategory = async () => {
    const name = prompt("Enter new category name:");
    if (name) {
       const newCat = await addCategory(name);
       if (newCat) {
          setListCategoryFilter(newCat.id); // Switch to new category
          setSelectedCategory(newCat.id);   // Set for new items
       }
    }
  };

  /* 
   * Replaced by handleDeleteCategoryWithConfirmation passed to item
  const handleDeleteCategory = () => {
    if (listCategoryFilter === "all") return;
    
    // Check if category has announcements
    const hasItems = announcements.some(a => a.categoryId === listCategoryFilter);
    if (hasItems) {
      alert("Cannot delete a category that contains announcements. Please move or delete them first.");
      return;
    }

    if (confirm(`Delete category '${categories.find(c => c.id === listCategoryFilter)?.label}'?`)) {
      deleteCategory(listCategoryFilter);
      setListCategoryFilter("all");
      if (selectedCategory === listCategoryFilter) {
         setSelectedCategory(categories[0]?.id ?? "");
      }
    }
  };
  */

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    if (manageCategoriesMode) {
        // Reordering Categories
        const oldIndex = categories.findIndex(c => c.id === active.id);
        const newIndex = categories.findIndex(c => c.id === over.id);
        reorderCategories(arrayMove(categories, oldIndex, newIndex));
    } else {
        // Reordering Announcements
        if (filteredAnnouncements.length !== announcements.length) {
            // Constrained reorder (within filtered list)
            // Just swap orders in main list? No, that's messy.
            // Move item to be next to target in main list.
            const oldIndex = announcements.findIndex((item) => item.id === active.id);
            const newIndex = announcements.findIndex((item) => item.id === over.id);
            reorderAnnouncements(arrayMove(announcements, oldIndex, newIndex));
        } else {
            // Simple reorder
            const oldIndex = announcements.findIndex((item) => item.id === active.id);
            const newIndex = announcements.findIndex((item) => item.id === over.id);
            reorderAnnouncements(arrayMove(announcements, oldIndex, newIndex));
        }
    }
  };

  const handleUpdateCategory = (id: string, newLabel: string) => {
      // Basic validation
      if (!newLabel.trim()) return;
      updateCategory(id, newLabel);
  };

  const handleDeleteCategoryWithConfirmation = (id: string) => {
      // Check if category has announcements
      const hasItems = announcements.some(a => a.categoryId === id);
      if (hasItems) {
        alert("Cannot delete a category that contains announcements. Please move or delete items first.");
        return;
      }
      if (confirm("Delete this category?")) {
          deleteCategory(id);
      }
  };

  const handleSelect = (id: string) => {
    const item = announcements.find((a) => a.id === id);
    if (!item) return;

    setSelectedId(item.id);
    setTitle(item.title);
    setSelectedCategory(item.categoryId);
    setIsActive(item.active);

    // Convert string[] to HTML for editor
    // If content is just one string with HTML tags, use it directly
    // If it's pure text paragraphs, wrap them
    const htmlContent = item.content
      .map((p) => (p.startsWith("<") ? p : `<p>${p}</p>`))
      .join("");
    
    editor?.commands.setContent(htmlContent);
  };

  const handleNew = () => {
    setSelectedId(null);
    setTitle("New announcement");
    // Default to the currently filtered category if active, else first avail
    setSelectedCategory(listCategoryFilter !== "all" ? listCategoryFilter : categories[0]?.id ?? "");
    setIsActive(true);
    editor?.commands.setContent("<p>Type the announcement content here.</p>");
  };

  const handleSave = () => {
    if (!editor) return;
    
    // Simple way to get content: array with one HTML string
    // Or we could parse paragraphs. For now, let's keep it simple and consistent.
    // Ideally we would parse the JSON to strings but preserving HTML formatting requires storing HTML.
    const content = [editor.getHTML()]; 
    
    // Reconstruct the object to save
    const announcementData = {
      title,
      categoryId: selectedCategory,
      active: isActive,
      content
    };

    if (selectedId) {
      // Update
      const existing = announcements.find(a => a.id === selectedId);
      if (existing) {
         updateAnnouncement({ ...existing, ...announcementData });
      }
    } else {
      // Create
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        ...announcementData
      };
      addAnnouncement(newAnnouncement);
      setSelectedId(newAnnouncement.id);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(selectedId);
      handleNew();
    }
  };

  return (
    <main className="min-h-screen bg-night px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">Supervisor editor</h1>
          <p className="max-w-3xl text-sm text-white/70">
            Online-only editor for managing announcement content. Changes here are local previews
            only until they are committed and deployed.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[250px_1fr_1fr]">
          {/* List Column */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 h-fit">
            <button
              onClick={handleNew}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              + New Announcement
            </button>

            {/* Category Filter and Creator */}
            <div className="space-y-2">
              {!manageCategoriesMode && (
                <select 
                  className="w-full rounded-md border border-white/10 bg-night px-2 py-2 text-sm text-white"
                  value={listCategoryFilter}
                  onChange={(e) => setListCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </select>
              )}
              
              <div className="flex gap-2">
                <button 
                  onClick={handleCreateCategory}
                  className="flex flex-1 items-center justify-center rounded-md border border-white/10 bg-white/5 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span className="mr-1">+</span> New Category
                </button>
                <button 
                    onClick={() => setManageCategoriesMode(!manageCategoriesMode)}
                    className={`flex flex-1 items-center justify-center rounded-md border py-1.5 text-xs transition-colors ${
                        manageCategoriesMode 
                        ? "bg-blue-600 border-blue-600 text-white" 
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                    {manageCategoriesMode ? 'Done' : 'Edit Categories'}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider text-white/50">
                  <h3>
                    {manageCategoriesMode 
                        ? 'All Categories' 
                        : (listCategoryFilter === 'all' ? 'All Items' : categories.find(c => c.id === listCategoryFilter)?.label)
                    }
                  </h3>
                  <span className="text-[10px] opacity-60">
                      {manageCategoriesMode ? 'Drag to reorder' : 'Drag handle to reorder'}
                  </span>
              </div>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                {manageCategoriesMode ? (
                    <SortableContext 
                        items={categories.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                         <div className="flex flex-col gap-1">
                            {categories.map((c) => (
                                <SortableCategoryItem
                                    key={c.id}
                                    category={c}
                                    onUpdate={handleUpdateCategory}
                                    onDelete={handleDeleteCategoryWithConfirmation}
                                />
                            ))}
                         </div>
                    </SortableContext>
                ) : (
                    <SortableContext 
                    items={filteredAnnouncements.map(a => a.id)}
                    strategy={verticalListSortingStrategy}
                    >
                    <div className="flex flex-col gap-1">
                        {filteredAnnouncements.map((a) => (
                        <SortableItem
                            key={a.id}
                            id={a.id}
                            announcement={a}
                            categories={categories}
                            isSelected={selectedId === a.id}
                            onSelect={handleSelect}
                        />
                        ))}
                        {filteredAnnouncements.length === 0 && (
                            <div className="py-4 text-center text-xs text-white/30 italic">No announcements</div>
                        )}
                    </div>
                    </SortableContext>
                )}
              </DndContext>
            </div>
          </div>

          {/* Editor Column */}
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap gap-4">
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                Title
                <input
                  className="rounded-md border border-white/10 bg-night px-3 py-2 text-sm text-white"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                Category
                <select
                  className="rounded-md border border-white/10 bg-night px-3 py-2 text-sm text-white"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                />
                Active
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleBold().run()}>
                Bold
              </button>
              <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                Italic
              </button>
              <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                Underline
              </button>
              <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                H2
              </button>
              <button type="button" className={toolbarButton} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                Bullet list
              </button>
            </div>

            <div className="rounded-xl border border-white/10 bg-night px-4 py-3">
              <EditorContent editor={editor} className="min-h-[200px] text-sm text-white/90" />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
              >
                {selectedId ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Update Changes
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                    Save New Announcement
                  </>
                )}
              </button>
              {selectedId && (
                <button
                  onClick={handleDelete}
                  className="flex items-center rounded-md bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-600/30"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
            
            <p className="text-xs text-white/50">
              Saving in this prototype is local only. Commit changes to the data files and redeploy
              to update tablets.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="rounded-xl border border-white/10 bg-night/70 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                <span>{previewCategory?.label ?? "Category"}</span>
                <span>{isActive ? "Active" : "Inactive"}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
              <div
                className="prose prose-invert mt-4 max-w-none text-sm [&>p]:mb-2 [&>p:last-child]:mb-0"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: previewHTML }}
              />
            </div>
            <div className="text-xs text-white/50">
              Existing announcements: {announcements.length}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
