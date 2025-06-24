import { useEffect } from "react"
import { useRouter } from "next/router"

// This index file redirects to the filtering page
const ExploreDashboard = () => {
  const router = useRouter()

  useEffect(() => {
    void router.replace("/explore/filtering")
  }, [router])

  return null
}

export default ExploreDashboard
