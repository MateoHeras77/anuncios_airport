"use client";

import { useRouter } from "next/navigation";

export default function EditorButton() {
  const router = useRouter();

  const handleClick = () => {
    const password = prompt("Enter supervisor password:");
    if (password === "Avianca26") {
      router.push("/admin");
    } else if (password !== null) {
      alert("Incorrect password");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
    >
      Editor
    </button>
  );
}
