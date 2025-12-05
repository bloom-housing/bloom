import { useEffect, useRef, useState } from "react"

interface useIntersectProps {
  root?: Element | null
  rootMargin?: string
  threshold?: number
}

/**
 * Use this hook to obtain state when an element is visible or not relative to
 * an ancestor element (or by default the browser viewport)
 */
export const useIntersect = ({
  root = null,
  rootMargin = "0px",
  threshold = 0,
}: useIntersectProps) => {
  // broadly based on this source code:
  // https://non-traditional.dev/how-to-use-an-intersectionobserver-in-a-react-hook-9fb061ac6cb5

  const [intersecting, setIntersecting] = useState(false)
  const [element, setIntersectingElement] = useState<Element | null>(null)

  const observer = useRef<IntersectionObserver | null>(null)

  // Instantiate the observer upon element mount
  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    if (element) {
      observer.current = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting),
        {
          root,
          rootMargin,
          threshold,
        }
      )

      observer.current.observe(element)
    }

    // Unmount callback
    return () => observer?.current?.disconnect()
  }, [element, root, rootMargin, threshold])

  return { setIntersectingElement, intersecting }
}
