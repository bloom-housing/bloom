import { useContext } from "react"
import useSWR from "swr"

import { ApiClientContext } from "@bloom-housing/ui-components"
import { ApplicationDto, ListingDto } from "@bloom-housing/backend-core/client"

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
  const fetcher = (url) => applicationsService.list(params)
  const { data, error } = useSWR(backendApplicationsEndpointUrl, fetcher)

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
