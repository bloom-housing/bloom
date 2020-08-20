import { useEffect } from "react"

function useKeyPress(targetKey: string, callback: () => unknown) {
  useEffect(() => {
    function keyUp(e: KeyboardEvent) {
      if (e.key === targetKey) callback()
    }

    window.addEventListener("keyup", keyUp)

    return () => {
      window.removeEventListener("keyup", keyUp)
    }
  }, [targetKey, callback])
}

export default useKeyPress
