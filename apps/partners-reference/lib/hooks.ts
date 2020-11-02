import { useContext } from "react"
import useSWR from "swr"

import { ApiClientContext } from "@bloom-housing/ui-components"
import { Application, Listing } from "@bloom-housing/core"

export function useListingsData() {
  const fetcher = (url) => fetch(url).then((r) => r.json())
  const { data, error } = useSWR(process.env.listingServiceUrl, fetcher)
  if (data && data.status == "ok") {
    console.log(data)
    console.log(`Listings Data Received: ${data.listings}`)
  }
  return {
    listingDtos: data,
    listingsLoading: !error && !data,
    listingsError: error,
  }
}

export function useApplicationsData(listingId?: string) {
  const { listingDtos, listingsLoading, listingsError } = useListingsData()
  const { applicationsService } = useContext(ApiClientContext)
  const backendApplicationsEndpointUrl = process.env.backendApiBase + "/applications"
  const params = listingId ? { listingId } : {}
  const fetcher = () => applicationsService.list(params)
  const { data, error } = useSWR(backendApplicationsEndpointUrl, fetcher)
  const applications: Application[] = []
  // if (listingDtos && data) {
  //   console.log(`Applications Data Received: ${data.items.length}`)
  //   const listings: Record<string, Listing> = Object.fromEntries(
  //     listingDtos.listings.map((e) => [e.id, e])
  //   )
  //   data.items.forEach((application) => {
  //     const app: Application = application
  //     app.listing = listings[application.listing.id]
  //     applications.push(app)
  //     console.log(`Assigned ${listings[application.listing.id].name} to ${application.id}`)
  //   })
  // }
  return {
    applications: data?.items,
    appsLoading: !error && !data,
    appsError: error,
  }
}

export function useSingleApplicationData(applicationId: string) {
  const { applicationsService } = useContext(ApiClientContext)
  const backendSingleApplicationsEndpointUrl = `${process.env.backendApiBase}/applications/${applicationId}`

  const fetcher = () => applicationsService.retrieve({ applicationId })
  const { data, error } = useSWR(backendSingleApplicationsEndpointUrl, fetcher)

  return {
    applicationDto: data,
    applicationLoading: !error && !data,
    applicationError: error,
  }
}
