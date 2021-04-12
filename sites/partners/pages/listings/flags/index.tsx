import React from "react"
import Head from "next/head"
import { useRouter } from "next/router"
// import { AgGridReact } from "ag-grid-react"

import { useFlaggedApplicationsList } from "../../../lib/hooks"
import Layout from "../../../layouts/application"
import { t, ListingSecondaryNav } from "@bloom-housing/ui-components"
// import { cols } from "../../../src/flags/cols"

const FlagsPage = () => {
  const router = useRouter()
  const listingId = router.query.listing as string

  const { data } = useFlaggedApplicationsList({
    listingId,
  })

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>

      {/* TODO: add translation */}
      <ListingSecondaryNav title="Flags" listingId={listingId} flagsQty={0} />

      {console.log(data)}
    </Layout>
  )
}

export default FlagsPage
