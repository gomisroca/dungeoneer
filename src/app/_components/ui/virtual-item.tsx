import { useEffect, useRef, useState } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry) setIsVisible(entry.isIntersecting); },
      { threshold: 0, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? (
        children
      ) : (
        <div
          className="flex items-center justify-center bg-zinc-100 text-zinc-400 dark:bg-zinc-900"
          style={{ height: `${height}px` }}>
          {placeholder ?? <div className="text-sm">Loading...</div>}
        </div>
      )}
    </div>
  );
}