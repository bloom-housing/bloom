import { SyntheticEvent, useCallback, useEffect, useRef } from "react"

export function useFallbackImage(fallbackSrc?: string) {
  const imgParentRef = useRef<HTMLDivElement>(null)
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])

  const onError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      if (fallbackSrc) {
        e.currentTarget.src = fallbackSrc
      }
    },
    [fallbackSrc]
  )

  useEffect(() => {
    if (imgParentRef && imgParentRef.current && fallbackSrc) {
      const numberOfImages = imgParentRef.current.children.length
      for (let i = 0; i < numberOfImages; i++) {
        const imgRef = imgRefs.current[i]
        if (imgRef) {
          const { complete, naturalHeight } = imgRef
          const errorLoadingImgBeforeHydration = complete && naturalHeight === 0
          if (errorLoadingImgBeforeHydration) {
            imgRef.src = fallbackSrc
          }
        }
      }
    }
  }, [fallbackSrc])

  return {
    imgParentRef,
    imgRefs,
    onError,
  }
}
