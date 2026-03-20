'use client'

import Image from 'next/image'

interface ContentSectionProps {
  title?: string
  subtitle?: string
  content: string
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  bgImageUrl?: string
  bgVideoUrl?: string
  bgOverlayOpacity?: number
}

const maxWidthClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function ContentSection({
  title,
  subtitle,
  content,
  backgroundColor = 'bg-white',
  textAlign = 'left',
  maxWidth = 'lg',
  bgImageUrl,
  bgVideoUrl,
  bgOverlayOpacity = 0.55,
}: ContentSectionProps) {
  const hasBg = !!(bgImageUrl || bgVideoUrl)
  const overlayStyle = { backgroundColor: `rgba(0,0,0,${bgOverlayOpacity})` }

  return (
    <section className={`relative py-16 md:py-24 overflow-hidden ${hasBg ? '' : backgroundColor}`}>
      {/* Video background */}
      {bgVideoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={bgVideoUrl}
        />
      )}

      {/* Image background */}
      {bgImageUrl && !bgVideoUrl && (
        <Image
          src={bgImageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      )}

      {/* Overlay */}
      {hasBg && (
        <div className="absolute inset-0" style={overlayStyle} />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className={`${maxWidthClass[maxWidth]} ${textAlign === 'center' ? 'mx-auto text-center' : ''}`}>
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${hasBg ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`text-lg mb-6 ${hasBg ? 'text-white/80' : 'text-gray-600'}`}>{subtitle}</p>
          )}
          <div
            className={`prose prose-sm md:prose-base max-w-none ${hasBg ? 'prose-invert' : ''}`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  )
}
