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
  const [isVisible, setIsVisible] = useState<boolean | null>(null); // null = not yet determined
  const observerRef = useRef<IntersectionObserver | null>(null);

  const checkVisibility = useCallback(() => {
    if (!ref.current) return false;
    
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const margin = parseInt(rootMargin) || 100;
    
    // Check if element is within viewport + margin
    return rect.bottom > -margin && rect.top < windowHeight + margin;
  }, [rootMargin]);

  useEffect(() => {
    // Initial visibility check
    const initiallyVisible = checkVisibility();
    setIsVisible(initiallyVisible);
    
    // Set up intersection observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setIsVisible(visible);
      },
      { 
        threshold: 0,
        rootMargin
      }
    );

    const currentRef = ref.current;
    if (currentRef && observerRef.current) {
      observerRef.current.observe(currentRef);
    }

    // Cleanup
    return () => {
      if (currentRef && observerRef.current) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [checkVisibility, rootMargin]);

  // Handle scroll events for more responsive updates
  useEffect(() => {
    const handleScroll = () => {
      if (isVisible === null) {
        // Only do manual check if we haven't determined visibility yet
        const visible = checkVisibility();
        setIsVisible(visible);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkVisibility, isVisible]);



  // Show loading state while determining visibility
  if (isVisible === null) {
    return (
      <div ref={ref}>
        <div 
          className="flex items-center justify-center bg-gray-50 text-gray-400"
          style={{ height: `${height}px` }}
        >
          <div style={{ fontSize: '10px' }}>🔍 CHECKING...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      {isVisible ? (
          <>{children}</>
      ) : (
        <>
          {placeholder || 'Not in viewport'}
        </>
      )}
    </div>
  );
}