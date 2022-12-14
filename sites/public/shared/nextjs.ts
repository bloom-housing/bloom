import { useEffect, useState } from "react"

export const OnClientSide = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
