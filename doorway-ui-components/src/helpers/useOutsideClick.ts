import { useEffect, useCallback, RefObject } from "react"

type OutsideClickProps = {
  ref: RefObject<Element>
  callback: () => unknown
}

export const useOutsideClick = ({ ref, callback }: OutsideClickProps) => {
  const handleClick = useCallback(
    (e: any) => {
      if (ref?.current && !ref.current.contains(e.target)) {
        callback()
      }
    },
    [ref, callback]
  )

  useEffect(() => {
    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  })
}
