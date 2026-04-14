import { useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll(onLoadMore, hasMore) {
  const sentinelRef = useRef(null)

  const observe = useCallback(() => {
    if (!sentinelRef.current || !hasMore) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' }
    )
    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [onLoadMore, hasMore])

  useEffect(() => {
    const cleanup = observe()
    return cleanup
  }, [observe])

  return sentinelRef
}
