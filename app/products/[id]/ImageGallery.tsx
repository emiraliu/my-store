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

  const current = images[index] ?? null

  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '0 0 24px 24px' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {!current ? (
        <div style={{
          width: '100%', height: '100%',
          backgroundColor: toneColor,
          backgroundImage: 'repeating-linear-gradient(135deg, rgba(44,37,32,0.025) 0 1px, transparent 1px 14px)',
        }}>
          <span style={{
            position: 'absolute', left: 12, bottom: 12,
            fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'rgba(44,37,32,0.65)',
            background: 'rgba(251,247,239,0.7)', padding: '2px 5px', borderRadius: 3,
          }}>
            PHOTO · {firstWord}
          </span>
        </div>
      ) : isVideo(current) ? (
        <video
          src={current}
          autoPlay muted loop playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <Image
          src={current}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          sizes="100vw"
          priority={index === 0}
        />
      )}

      {images.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 5,
        }}>
          {images.map((_, i) => (
            <span key={i} style={{
              width: i === index ? 18 : 5, height: 5, borderRadius: 999,
              background: i === index ? 'var(--c-ink)' : 'rgba(44,37,32,0.3)',
              transition: 'width 0.2s',
            }} />
          ))}
        </div>
      )}
    </div>
  )
}
