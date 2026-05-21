'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

const VIDEO_EXTS = ['mp4', 'mov', 'webm', 'ogg', 'avi']
function isVideo(url: string) {
  return VIDEO_EXTS.includes(url.split('.').pop()?.split('?')[0]?.toLowerCase() ?? '')
}

interface Props {
  images: string[]
  alt: string
  toneColor: string
  firstWord: string
}

const MAX_VISIBLE_DOTS = 5

function Dots({ total, index }: { total: number; index: number }) {
  if (total <= 1) return null

  // Compute a sliding window of up to MAX_VISIBLE_DOTS centered on the active index
  const half = Math.floor(MAX_VISIBLE_DOTS / 2)
  let start = Math.max(0, index - half)
  const end = Math.min(total - 1, start + MAX_VISIBLE_DOTS - 1)
  if (end - start < MAX_VISIBLE_DOTS - 1) start = Math.max(0, end - MAX_VISIBLE_DOTS + 1)

  return (
    <div style={{
      position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', gap: 5, alignItems: 'center',
    }}>
      {Array.from({ length: end - start + 1 }, (_, k) => {
        const i = start + k
        const isActive = i === index
        // Edge dots hint there are more images beyond the visible window
        const isEdge = (i === start && start > 0) || (i === end && end < total - 1)
        return (
          <span key={i} style={{
            width: isActive ? 18 : isEdge ? 4 : 5,
            height: isActive ? 5 : isEdge ? 4 : 5,
            borderRadius: 999,
            background: isActive ? 'var(--c-ink)' : 'rgba(0,0,0,0.35)',
            opacity: isEdge ? 0.45 : 1,
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s',
            flexShrink: 0,
          }} />
        )
      })}
    </div>
  )
}

export default function ImageGallery({ images, alt, toneColor, firstWord }: Props) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(0)

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) < 40) return
    if (delta > 0 && index < images.length - 1) setIndex(i => i + 1)
    if (delta < 0 && index > 0) setIndex(i => i - 1)
  }

  if (images.length === 0) {
    return (
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden',
        borderRadius: '0 0 24px 24px', backgroundColor: toneColor,
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 14px)',
      }}>
        <span style={{
          position: 'absolute', left: 12, bottom: 12,
          fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'rgba(0,0,0,0.65)',
          background: 'rgba(255,255,255,0.7)', padding: '2px 5px', borderRadius: 3,
        }}>
          PHOTO · {firstWord}
        </span>
      </div>
    )
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '0 0 24px 24px' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Sliding strip — all images in a row, translated to show the active one */}
      <div style={{
        display: 'flex',
        width: `${images.length * 100}%`,
        height: '100%',
        transform: `translateX(${(-index * 100) / images.length}%)`,
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      }}>
        {images.map((img, i) => (
          <div key={i} style={{ width: `${100 / images.length}%`, height: '100%', flexShrink: 0, position: 'relative' }}>
            {isVideo(img) ? (
              <video
                src={img}
                autoPlay={i === index} muted loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                priority={i === 0}
              />
            )}
          </div>
        ))}
      </div>

      <Dots total={images.length} index={index} />
    </div>
  )
}
