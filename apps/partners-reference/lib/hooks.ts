import { useContext } from "react"
import useSWR from "swr"

import { Application } from "@bloom-housing/core"
import { ApiClientContext } from "@bloom-housing/ui-components"
import { Listing } from "@bloom-housing/backend-core"

export function useListingsData() {
  const fetcher = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR("http://localhost:3100", fetcher)
  if (data && data.status == "ok") {
    console.log(`Listings Data Received: ${data.listings.length}`)
  }
  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData() {
  const { listingDtos, listingsLoading, listingsError } = useListingsData()
  const { applicationsService } = useContext(ApiClientContext)
  const fetcher = (url) => applicationsService.list()
  const { data, error } = useSWR("http://localhost:3100/applications", fetcher)
  const applications: Application[] = []
  if (listingDtos && data) {
    console.log(`Applications Data Received: ${data.length}`)
    const listings: Record<string, Listing> = Object.fromEntries(
      listingDtos.listings.map((e) => [e.id, e])
    )
    data.forEach((application) => {
      const app: Application = application
      app.listing = listings[application.listing.id]
      applications.push(app)
      console.log(`Assigned ${app.listing.name} to ${application.id}`)
    })
  }
  return {
    applicationDtos: applications,
    appsLoading: listingsLoading || (!error && !data),
    appsError: listingsError || error,
  }
}
