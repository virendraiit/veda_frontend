"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoSlide {
  id: number
  videoUrl: string
  title: string
  subtitle: string
  description: string
  ctaText?: string
  ctaLink?: string
  overlayColor?: string
}

interface VideoSliderProps {
  videos: VideoSlide[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  showIndicators?: boolean
  className?: string
}

export function VideoSlider({
  videos,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className,
}: VideoSliderProps) {
  const [api, setApi] = useState<any>(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState<boolean[]>(new Array(videos.length).fill(false))
  const [isMuted, setIsMuted] = useState<boolean[]>(new Array(videos.length).fill(true)) // All muted by default
  const [isHovering, setIsHovering] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize video refs array
  useEffect(() => {
    videoRefs.current = new Array(videos.length).fill(null)
  }, [videos.length])

  // Set up carousel API and event listeners
  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap()
      setCurrent(newIndex + 1)
      
      // Pause all videos first
      videoRefs.current.forEach((videoRef, index) => {
        if (videoRef) {
          videoRef.pause()
          setIsPlaying(prev => {
            const newState = [...prev]
            newState[index] = false
            return newState
          })
        }
      })

      // Play only the current video
      const currentVideoRef = videoRefs.current[newIndex]
      if (currentVideoRef) {
        currentVideoRef.play().then(() => {
          setIsPlaying(prev => {
            const newState = [...prev]
            newState[newIndex] = true
            return newState
          })
        }).catch(console.error)
      }
    })
  }, [api])

  // Handle auto-play with hover detection
  useEffect(() => {
    if (!api || !autoPlay) return

    const startAutoPlay = () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
      }
      autoPlayIntervalRef.current = setInterval(() => {
        if (!isHovering) {
          api.scrollNext()
        }
      }, autoPlayInterval)
    }

    const stopAutoPlay = () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
        autoPlayIntervalRef.current = null
      }
    }

    if (isHovering) {
      stopAutoPlay()
    } else {
      startAutoPlay()
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
      }
    }
  }, [api, autoPlay, autoPlayInterval, isHovering])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current)
      }
    }
  }, [])

  const togglePlay = (index: number) => {
    const videoRef = videoRefs.current[index]
    if (videoRef) {
      if (isPlaying[index]) {
        videoRef.pause()
      } else {
        // Pause all other videos first
        videoRefs.current.forEach((ref, i) => {
          if (ref && i !== index) {
            ref.pause()
            setIsPlaying(prev => {
              const newState = [...prev]
              newState[i] = false
              return newState
            })
          }
        })
        
        // Play the selected video
        videoRef.play().catch(console.error)
      }
    }
    
    const newPlaying = [...isPlaying]
    newPlaying[index] = !newPlaying[index]
    setIsPlaying(newPlaying)
  }

  const toggleMute = (index: number) => {
    const videoRef = videoRefs.current[index]
    if (videoRef) {
      videoRef.muted = !isMuted[index]
    }
    
    const newMuted = [...isMuted]
    newMuted[index] = !newMuted[index]
    setIsMuted(newMuted)
  }

  const handleVideoLoad = (index: number) => {
    const videoRef = videoRefs.current[index]
    if (videoRef) {
      // Ensure video is muted by default
      videoRef.muted = true
      setIsMuted(prev => {
        const newState = [...prev]
        newState[index] = true
        return newState
      })

      // Only auto-play the first video when it loads
      if (index === 0) {
        videoRef.play().then(() => {
          setIsPlaying(prev => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }).catch(console.error)
      }
    }
  }

  const handleVideoError = (index: number, error: any) => {
    console.error(`Video ${index} error:`, error)
    console.error(`Video URL:`, videos[index].videoUrl)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <div 
      className={cn("relative w-full", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className="pl-0">
              <div className="relative w-full h-[600px] overflow-hidden">
                {/* Video Background */}
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  className="w-full h-full object-cover"
                  autoPlay={index === 0}
                  muted={true} // Always muted by default
                  loop
                  playsInline
                  preload="metadata"
                  controls={false}
                  onLoadedData={() => handleVideoLoad(index)}
                  onError={(e) => handleVideoError(index, e)}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Text Content */}
                <div className="absolute inset-0 flex items-end justify-start z-10">
                  <div className="px-8 pb-4">
                    <div className="max-w-3xl text-white">
                      <h2 className="text-3xl font-bold mb-3 leading-tight text-shadow-lg">
                        {video.title}
                      </h2>
                      <p className="text-base mb-4 text-white leading-relaxed text-shadow-md">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Color Overlay - Bottom Left */}
                <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-5">
                  <div 
                    className="w-full h-full"
                    style={{
                      background: video.overlayColor ? 
                        (video.overlayColor.includes('purple') ? 'linear-gradient(90deg, rgba(147, 51, 234, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)' :
                         video.overlayColor.includes('blue') ? 'linear-gradient(90deg, rgba(59, 130, 246, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)' :
                         video.overlayColor.includes('green') ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)' :
                         video.overlayColor.includes('orange') ? 'linear-gradient(90deg, rgba(249, 115, 22, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)' :
                         video.overlayColor.includes('cyan') ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)' :
                         video.overlayColor.includes('indigo') ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)' :
                         'linear-gradient(90deg, rgba(59, 130, 246, 0.6) 0%, rgba(0, 0, 0, 0.2) 100%)') :
                        'linear-gradient(90deg, rgba(59, 130, 246, 0.6) 0%, rgba(147, 51, 234, 0.6) 100%)'
                    }}
                  />
                </div>

                {/* Video Controls */}
                {showControls && (
                  <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={() => togglePlay(index)}
                    >
                      {isPlaying[index] ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={() => toggleMute(index)}
                    >
                      {isMuted[index] ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="left-4 bg-black/50 hover:bg-black/70 text-white border-0" />
        <CarouselNext className="right-4 bg-black/50 hover:bg-black/70 text-white border-0" />

        {/* Indicators */}
        {showIndicators && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  current === index + 1
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {current} / {count}
        </div>
      </Carousel>
    </div>
  )
} 