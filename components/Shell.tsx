"use client"
import Link from "next/link"
export default function Shell({ children, darkMode, onToggle }:{ children: React.ReactNode, darkMode: boolean, onToggle:()=>void }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-zinc-800">
        <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">AppForge</Link>
        <button onClick={onToggle} className="rounded-full border border-zinc-300 dark:border-zinc-600 p-2 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700">
          {darkMode ? "🌙" : "☀️"}
        </button>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
