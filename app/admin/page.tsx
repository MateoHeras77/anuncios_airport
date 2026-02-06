"use client";

import { useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { announcements, categories } from "../data/announcements";

const toolbarButton =
  "rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 hover:bg-white/10";

export default function AdminPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const [title, setTitle] = useState("New announcement");
  const [isActive, setIsActive] = useState(true);

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
    [selectedCategory]
  );

  return (
    <main className="min-h-screen bg-night px-6 py-10 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold">Supervisor editor</h1>
          <p className="max-w-3xl text-sm text-white/70">
            Online-only editor for managing announcement content. Changes here are local previews
            only until they are committed and deployed.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
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
                className="prose prose-invert mt-4 max-w-none text-sm"
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
