export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold">AppForge</h1>
        <p className="mt-2 text-zinc-600">Upload your app, we’ll generate your Store listing and one-pager.</p>
        <a href="/dashboard" className="mt-6 inline-block rounded bg-black text-white px-4 py-2">Go to Dashboard</a>
      </div>
    </main>
  )
}
