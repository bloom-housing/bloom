import { useEffect } from "react"
import { useRouter } from "next/router"

// This index file redirects to the application-analysis page
// The filtering functionality is now embedded as a slide-out menu
const ExploreDashboard = () => {
  const router = useRouter()

  useEffect(() => {
    void router.replace("/explore/application-analysis")
  }, [router])

  return null
}

export default ExploreDashboard
