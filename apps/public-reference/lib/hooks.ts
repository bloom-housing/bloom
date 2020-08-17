import { useRouter } from "next/router"

export function useRedirectToPrevPage(defaultPath = "/") {
  const router = useRouter()

  const redirectTo = (typeof document !== "undefined" && document.referrer) || defaultPath
  return (queryParams: Record<string, any> = {}) => {
    router.push({
      pathname: redirectTo,
      query: queryParams,
    })
  }
}
