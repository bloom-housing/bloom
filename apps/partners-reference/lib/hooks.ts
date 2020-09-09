import { useContext } from "react"
import useSWR from "swr"

import { ApiClientContext } from "@bloom-housing/ui-components"
import { ApplicationDto, ListingDto } from "@bloom-housing/backend-core/client"

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
  const applications: ApplicationDto[] = []
  if (listingDtos && data) {
    console.log(`Applications Data Received: ${data.length}`)
    const listings: Record<string, ListingDto> = Object.fromEntries(
      listingDtos.listings.map((e) => [e.id, e])
    )
    data.forEach((application) => {
      const app: ApplicationDto = application
      app.listing = listings[application.listing.id]
      applications.push(app)
      console.log(`Assigned ${listings[application.listing.id].name} to ${application.id}`)
    })
  }
  return {
    applicationDtos: applications,
    appsLoading: listingsLoading || (!error && !data),
    appsError: listingsError || error,
  }
}
