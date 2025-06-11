import { useEffect, useRef, useState, useCallback } from 'react';

interface VirtualItemProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  height?: number;
  rootMargin?: string;
}

export default function VirtualItem({ 
  children, 
  placeholder,
  height = 200,
  rootMargin = '100px',
}: VirtualItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false) // Start with false instead of null
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const checkVisibility = useCallback(() => {
    if (!ref.current) return false;
    
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const margin = parseInt(rootMargin) || 100;
    
    // Check if element is within viewport + margin
    return rect.bottom > -margin && rect.top < windowHeight + margin;
  }, [rootMargin]);

  useEffect(() => {
    // Cleanup any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set up intersection observer first
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsVisible(entry.isIntersecting)
        }
      },
      {
        threshold: 0,
        rootMargin,
      },
    )

    const currentRef = ref.current
    if (currentRef && observerRef.current) {
      observerRef.current.observe(currentRef)

      // Do initial visibility check after a short delay to ensure DOM is ready
      timeoutRef.current = setTimeout(() => {
        const visible = checkVisibility()
        setIsVisible(visible)
      }, 50)
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (currentRef && observerRef.current) {
        observerRef.current.unobserve(currentRef)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [checkVisibility, rootMargin])

  // Fallback visibility check on scroll - but throttled
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        // Only check if intersection observer might have missed something
        if (!isVisible) {
          const visible = checkVisibility()
          if (visible) {
            setIsVisible(true)
          }
        }
      }, 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [checkVisibility, isVisible])

   return (
    <div ref={ref}>
      {isVisible ? (
        <>{children}</>
      ) : (
        <div className="flex items-center justify-center bg-gray-50 text-gray-400" style={{ height: `${height}px` }}>
          {placeholder || <div className="text-sm">Loading...</div>}
        </div>
      )}
    </div>
  )
}