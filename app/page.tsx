export default function Home() {
  return (
    <div>
      <section className="flex flex-col items-center justify-center text-center min-h-[60vh] px-6 bg-gradient-to-br from-purple-600 to-blue-600">
        <h1 className="text-6xl font-bold text-white">Build app landing pages in minutes</h1>
        <p className="mt-4 text-xl text-white/90 max-w-2xl">AppForge crawls your app, generates ASO copy and privacy policies, then publishes a one-pager.</p>
        <div className="mt-8 flex gap-4">
          <a href="/dashboard" className="rounded-xl bg-black text-white px-6 py-3 transition-colors hover:bg-zinc-800">Get Started</a>
          <a href="/apps/example" className="rounded-xl border border-white text-white px-6 py-3 transition-colors hover:bg-white/10">See Example</a>
        </div>
      </section>
      <section className="max-w-6xl mx-auto py-24 px-6 grid md:grid-cols-3 gap-8">
        <div className="rounded-xl shadow-md p-6 bg-white dark:bg-zinc-800">
          <h3 className="text-lg font-semibold mb-2">Crawl &amp; capture</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">We visit your app, grab screenshots and build wireframes automatically.</p>
        </div>
        <div className="rounded-xl shadow-md p-6 bg-white dark:bg-zinc-800">
          <h3 className="text-lg font-semibold mb-2">ASO copy</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Generate App Store &amp; Google Play copy with one click.</p>
        </div>
        <div className="rounded-xl shadow-md p-6 bg-white dark:bg-zinc-800">
          <h3 className="text-lg font-semibold mb-2">Privacy policy</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Instant, customizable policies delivered in HTML, Markdown &amp; PDF.</p>
        </div>
      </section>
      <footer className="py-12 text-center text-sm text-zinc-500">
        <a href="https://twitter.com/appforge" className="mx-2 hover:underline">Twitter</a>
        <a href="https://github.com/appforge" className="mx-2 hover:underline">GitHub</a>
      </footer>
    </div>
  )
}
