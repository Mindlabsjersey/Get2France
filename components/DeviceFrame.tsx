import React from "react"

export default function DeviceFrame({ src, alt, caption }: { src: string; alt?: string; caption?: string }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-[2rem] border-4 border-black shadow-xl overflow-hidden bg-black">
        <img src={src} alt={alt || ""} className="w-full h-auto block" />
      </div>
      {caption ? (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="rounded-md bg-black/60 text-white text-xs px-2 py-1 line-clamp-1">{caption}</div>
        </div>
      ) : null}
    </div>
  )
}
