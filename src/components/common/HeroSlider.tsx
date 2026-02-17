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
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [autoplay, autoplayInterval, slides.length])

  if (slides.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <p className="text-gray-600">Galerie vide</p>
      </div>
    )
  }

  const slide = slides[currentSlide]
  const imageUrl = slide.image_url

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg">
      {/* Main Image */}
      <Image
        src={imageUrl}
        alt={slide.title}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">{slide.title}</h1>
        {slide.subtitle && (
          <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
        )}
        {slide.cta_text && slide.cta_link && (
          <Link
            href={slide.cta_link}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {slide.cta_text}
          </Link>
        )}
      </div>

      {/* Navigation Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
            aria-label="Previous slide"
          >
            {'<'}
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition"
            aria-label="Next slide"
          >
            {'>'}
          </button>
        </>
      )}
    </div>
  )
}
