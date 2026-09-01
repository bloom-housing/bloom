import { useEffect, useState } from "react"

export const OVERRIDES_TIMEOUT_MS = 5000

export function usePartnersOverrides(locale?: string) {
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>> | undefined>()
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const language = locale || "en"
    let superseded = false
    const timeout = setTimeout(() => controller.abort(), OVERRIDES_TIMEOUT_MS)

    const load = async () => {
      try {
        const response = await fetch(`/api/adapter/translations?language=${language}`, {
          signal: controller.signal,
        })
        const next = response.ok ? await response.json() : undefined
        if (superseded) return
        setOverrides(next)
      } catch {
        if (superseded) return
        setOverrides(undefined)
      } finally {
        clearTimeout(timeout)
      }
      setSettled(true)
    }

    void load()
    return () => {
      superseded = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [locale])

  return { overrides, settled }
}
