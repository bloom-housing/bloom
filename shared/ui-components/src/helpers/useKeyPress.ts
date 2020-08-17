import { useState, useEffect, useCallback } from "react"

type Handler = {
  key: string
}

function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false)

  const downHandler = useCallback(
    ({ key }: Handler) => {
      if (key === targetKey) {
        setKeyPressed(true)
      }
    },
    [targetKey]
  )

  const upHandler = useCallback(
    ({ key }: Handler) => {
      if (key === targetKey) {
        setKeyPressed(false)
      }
    },
    [targetKey]
  )

  useEffect(() => {
    window.addEventListener("keydown", downHandler)
    window.addEventListener("keyup", upHandler)

    return () => {
      window.removeEventListener("keydown", downHandler)
      window.removeEventListener("keyup", upHandler)
    }
  }, [downHandler, upHandler])

  return keyPressed
}

export default useKeyPress
