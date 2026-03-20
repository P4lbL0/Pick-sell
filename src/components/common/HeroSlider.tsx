'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeroSlide } from '@/lib/types'

interface HeroSliderProps {
  slides: HeroSlide[]
  autoplay?: boolean
  autoplayInterval?: number
}

export function HeroSlider({
  slides,
  autoplay = true,
  autoplayInterval = 5000,
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, autoplayInterval)
    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, slides.length])

  if (slides.length === 0) return null

  const slide = slides[currentSlide]
  const hasVideo = !!slide.video_url
  const hasImage = !!slide.image_url

  return (
    <div className="relative w-full h-[60vw] max-h-[600px] min-h-[320px] overflow-hidden">

      {/* Fond : vidéo prioritaire, sinon image, sinon gradient */}
      {hasVideo ? (
        <video
          key={slide.video_url}
          src={slide.video_url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : hasImage ? (
        <Image
          src={slide.image_url}
          alt={slide.title || 'Bannière'}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}

      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu centré */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        {slide.title && (
          <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">
            {slide.title}
          </h1>
        )}
        {slide.subtitle && (
          <p className="text-base md:text-xl mb-6 max-w-xl opacity-90 drop-shadow">
            {slide.subtitle}
          </p>
        )}
        {slide.cta_text && slide.cta_link && (
          <Link
            href={slide.cta_link}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            {slide.cta_text}
          </Link>
        )}
      </div>

      {/* Flèches */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full transition flex items-center justify-center text-lg backdrop-blur-sm"
            aria-label="Précédent"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full transition flex items-center justify-center text-lg backdrop-blur-sm"
            aria-label="Suivant"
          >
            ›
          </button>
        </>
      )}

      {/* Points de navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
