import React from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  )
}

interface PageLoaderProps {
  text?: string
  className?: string
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  text = "Loading...", 
  className 
}) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/40 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
        </div>
        <p className="text-lg font-medium text-muted-foreground animate-pulse">{text}</p>
      </div>
    </div>
  )
}

interface ButtonLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({ 
  size = 'md', 
  text = "Loading...",
  className 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      <span>{text}</span>
    </div>
  )
}

interface CardLoaderProps {
  className?: string
}

export const CardLoader: React.FC<CardLoaderProps> = ({ className }) => {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-muted rounded animate-pulse w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded animate-pulse"></div>
        <div className="h-3 bg-muted rounded animate-pulse w-5/6"></div>
        <div className="h-3 bg-muted rounded animate-pulse w-4/6"></div>
      </div>
    </div>
  )
}

interface TableLoaderProps {
  rows?: number
  columns?: number
  className?: string
}

export const TableLoader: React.FC<TableLoaderProps> = ({ 
  rows = 5, 
  columns = 4,
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-4 bg-muted rounded animate-pulse flex-1"
              style={{ 
                animationDelay: `${(rowIndex + colIndex) * 0.1}s` 
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  )
}

interface ProgressLoaderProps {
  progress?: number
  text?: string
  className?: string
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({ 
  progress = 0,
  text = "Processing...",
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{text}</span>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  )
}

interface OverlayLoaderProps {
  isVisible: boolean
  text?: string
  className?: string
}

export const OverlayLoader: React.FC<OverlayLoaderProps> = ({ 
  isVisible, 
  text = "Loading...",
  className 
}) => {
  if (!isVisible) return null

  return (
    <div className={cn("fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}

interface RefreshButtonProps {
  isLoading: boolean
  onClick: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  isLoading, 
  onClick, 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50",
        className
      )}
    >
      <RefreshCw className={cn(
        "animate-spin",
        sizeClasses[size],
        !isLoading && "animate-none"
      )} />
    </button>
  )
} 