'use client'

interface ContentSectionProps {
  title?: string
  subtitle?: string
  content: string
  backgroundColor?: string
  textAlign?: 'left' | 'center' | 'right'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
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
}: ContentSectionProps) {
  return (
    <section className={`py-16 md:py-24 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className={`${maxWidthClass[maxWidth]} ${textAlign === 'center' ? 'mx-auto text-center' : ''}`}>
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 mb-6">{subtitle}</p>
          )}
          <div
            className="text-gray-700 prose prose-sm md:prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  )
}
