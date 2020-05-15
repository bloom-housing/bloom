import { useEffect, useState } from "react"

export const onClientSide = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
