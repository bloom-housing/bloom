import React from "react"
import { fetchJurisdictionByName, fetchOpenListings } from "../../lib/hooks"
import { ListingBrowse, TabsIndexEnum } from "../../components/browse/ListingBrowse"
import { ListingsProps } from "../listings"

export default function ListingsPageFiltered(props: ListingsProps) {
  // const router = useRouter()
  // const { listingsService } = useContext(AuthContext)
  // const [filterState, setFilterState] = useState<FilterData>()
  // const [paginatedListings, setPaginatedListings] = useState<PaginatedListing>()
  // useEffect(() => {
  //   const fetchFilteredListings = async () => {
  //     const rawQuery = router.asPath.slice(router.asPath.indexOf("?") + 1)
  //     const filterState = decodeStringtoFilterData(rawQuery)
  //     setFilterState(filterState)
  //     console.log(filterState)
  //     const filters = encodeFilterDataToBackendFilters(filterState)
  //     console.log(filters)
  //     const query: ListingsQueryBody = {
  //       page: 1,
  //       view: ListingViews.base,
  //       filter: filters,
  //     }
  //     const listings = await listingsService.filterableList({ body: query })
  //     setPaginatedListings(listings)
  //   }
  //   fetchFilteredListings()
  // }, [router.query])

  return (
    <ListingBrowse
      listings={props.openListings}
      tab={TabsIndexEnum.closed}
      jurisdiction={props.jurisdiction}
      paginationData={props.paginationData}
    />
  )
}

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps(context: { req: any; query: any }) {
  // const filterState = decodeStringtoFilterData(
  //   context.req.url.slice(context.req.url.indexOf("?") + 1)
  // )
  // const filters = encodeFilterDataToBackendFilters(filterState)
  // const filteredListings = await fetchFilteredListings(
  //   context.req,
  //   Number(context.query.page) || 1,
  //   filters
  // )
  const filteredListings = await fetchOpenListings(context.req, Number(context.query.page) || 1)
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      openListings: filteredListings?.items || [],
      paginationData: filteredListings?.items?.length ? filteredListings.meta : null,
      jurisdiction: jurisdiction,
    },
  }
}
