'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

export function SkillRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: SkillRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const handleClick = (newRating: number) => {
    if (interactive && onChange) {
      onChange(newRating)
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => handleClick(star)}
          className={cn(
            'transition-colors',
            interactive && 'cursor-pointer hover:scale-110',
            !interactive && 'cursor-default'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-transparent text-muted-foreground'
            )}
          />
        </button>
      ))}
      {interactive && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/{maxRating}
        </span>
      )}
    </div>
  )
}

