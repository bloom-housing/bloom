import React from "react"
import { useRouter } from "next/router"

const FlagsPage = () => {
  const router = useRouter()

  const listingId = router.query.listing as string

  return <div>flags page {listingId}</div>
}

export default FlagsPage
