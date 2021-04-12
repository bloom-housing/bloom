import React from "react"
import { useRouter } from "next/router"

import { useFlaggedApplicationsList } from "../../../lib/hooks"
import Layout from "../../../layouts/application"

const FlagsPage = () => {
  const router = useRouter()
  const listingId = router.query.listing as string

  const { data } = useFlaggedApplicationsList({
    listingId,
  })

  return <Layout>{console.log(data)}</Layout>
}

export default FlagsPage
