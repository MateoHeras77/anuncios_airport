
## 1. Purpose (what problem this really solves)

This project provides **a reliable, offline-capable announcement reference tool** for airport ground staff using an **Android tablet**.

It replaces:

* paper scripts
* scattered documents
* memory-based announcements

With:

* a structured, categorized announcement viewer
* consistent wording
* fast access during boarding
* guaranteed availability even without internet

It is **not**:

* a workflow tracker
* a compliance system
* a multi-user collaborative platform

Those were intentionally excluded.

---

## 2. Scope (what is in / what is out)

### In scope

* Viewing announcements by category
* Rich-text formatted content (titles, subtitles, lists)
* Offline availability on Android
* Simple, intuitive navigation
* Centralized editing (online)

### Explicitly out of scope

* Per-user state (no “done / seen”)
* Offline editing
* Multi-device synchronization
* Auditing or logging
* Authentication complexity

This scoping is what makes the system simple **and** reliable.

---

## 3. High-level architecture

The system is split into **two logical modes**, but deployed as **one web project**.

### A. Viewer mode (PWA, offline-capable)

* Installed on Android tablet
* Used during operations
* Read-only
* Works without network

### B. Editor mode (online-only)

* Used by supervisors
* Requires internet
* Modifies announcement content
* Triggers redeploy or content refresh

There is **no backend server**, no database, and no API.

---

## 4. Technology stack

### Core framework

* **Next.js (App Router)**

  * Static generation
  * Client interactivity where needed
  * First-class Vercel support

### Hosting

* **Vercel**

  * CDN
  * Automatic builds
  * Custom domain

### Offline capability

* **Progressive Web App (PWA)**

  * Service Worker
  * Pre-caching of app shell and content
  * Cache-first strategy for announcements

### Styling

* Tailwind CSS or disciplined custom CSS
* Focus on readability and contrast (airport environment)

### Rich text editing

* **Tiptap**

  * WYSIWYG editor
  * Structured JSON output
  * Limited toolbar (Word-like)

---

## 5. Content model (single source of truth)

Announcements are **structured data**, not free text blobs.

### Conceptual model

* **Category**

  * id
  * label (e.g. “Boarding”)
  * order

* **Announcement**

  * id
  * title
  * content (Tiptap JSON)
  * categoryId
  * active

This content lives in:

* static JSON / TypeScript files
* version-controlled
* bundled at build time

This guarantees:

* predictability
* offline safety
* reproducibility

---

## 6. Viewer mode (tablet experience)

### Entry

* App opens directly to viewer
* No login
* No configuration

### Navigation

* Category selector at top
* One active category at a time
* Smooth content switching

### Content display

* Clear hierarchy:

  * section titles
  * subtitles
  * body text
* Optimized for quick reading
* No accidental editing

### Offline behavior

* App loads from cache
* All announcements available
* Visual parity with online mode
* Optional “Last updated at…” indicator

---

## 7. Editor mode (supervisor experience)

### Access

* Separate route (e.g. `/admin`)
* Online-only assumption
* Not designed for tablet ops

### Capabilities

* View all categories
* Create / edit announcements
* Assign categories
* Enable / disable announcements
* Preview rendered output

### Save behavior

Two acceptable models:

#### Preferred (build-time)

* Changes committed
* Vercel redeploys
* Tablets update when online

#### Acceptable fallback

* Changes stored locally for preview
* Explicit note that they are not global

There is no illusion of live sync.

---

## 8. Offline strategy (this is the backbone)

### First online load

* App shell cached
* Fonts cached
* Announcement data cached
* Routes cached

### Offline usage

* Service Worker serves cached assets
* Viewer fully functional
* No blank states

### Updates

* When internet is available:

  * new build downloaded silently
  * becomes active on next reload

No fragile “maybe it works” behavior.

---

## 9. Deployment & operational flow

1. Supervisor edits announcements online
2. Changes are committed / deployed
3. Vercel builds static app
4. Tablet reconnects to internet
5. PWA updates in background
6. New announcements available

This is deterministic and controllable.

---

## 10. Constraints (non-negotiable truths)

* Offline content can be stale
* Editing requires internet
* Tablets must load app once online
* No per-staff personalization
* No conflict resolution logic

These are **design choices**, not shortcomings.