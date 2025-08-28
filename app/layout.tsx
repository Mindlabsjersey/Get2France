"use client"
import "./globals.css"
import { useEffect, useState } from "react"
import Shell from "@/components/Shell"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem("theme")
    if (stored) {
      setDarkMode(stored === "dark")
    } else {
      const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefers)
    }
  }, [])
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])
  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
        <Shell darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)}>
          {children}
        </Shell>
      </body>
    </html>
  )
}
