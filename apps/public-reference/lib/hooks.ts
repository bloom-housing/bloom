import { useRouter } from "next/router"

export function useRedirectToPrevPage(defaultPath = "/") {
  const router = useRouter()

  return (queryParams: Record<string, any> = {}) => {
    const redirectUrl = router.query.redirectUrl

    router.push({
      pathname: redirectUrl && typeof redirectUrl === "string" ? redirectUrl : defaultPath,
      query: queryParams,
    })
  }
}
