import { Axios } from "axios"
import { Jurisdiction, Listing, ListingResponse, UrlInfo } from "../../types"
import { ExtractorInterface } from "./extractor-interface"
import { BaseStage } from "../base-stage"

export class Extractor extends BaseStage implements ExtractorInterface {
  axios: Axios
  urlInfo: UrlInfo

  // This constructor uses dependency injection for axios to enable easier mocking
  constructor(axios: Axios, urlInfo: UrlInfo) {
    super()
    this.axios = axios
    this.urlInfo = urlInfo
  }

  private constructEndpoint(id: string) {
    // Construct endpoint urls that get base info for all listings for each
    // jurisdiction individually rather than all at once. This enables us to
    // parallelize fetches and maximize cache hits on the external API
    return (
      this.urlInfo.base +
      this.urlInfo.path +
      "?view=base&limit=all&filter[0][$comparison]==&filter[0][status]=active" +
      `&filter[1][$comparison]==&filter[1][jurisdiction]=${id}`
    )
  }

  public async extract(jurisdictions: Jurisdiction[]): Promise<Array<Listing>> {
    const actions = []

    jurisdictions.forEach((jurisdiction: Jurisdiction) => {
      this.log(`Fetching listings for [${jurisdiction.name}]`)
      const endpoint = this.constructEndpoint(jurisdiction.id)

      actions.push(
        this.axios
          .get<ListingResponse>(endpoint)
          .catch((error) => {
            this.logger.error(
              `Unexpected HTTP error fetching listings for jurisdiction [${jurisdiction.name}]`
            )
            this.logger.error(`Error URL: [${endpoint}]`)
            throw error
          })
          .then((response) => {
            return {
              response: response,
              jurisdiction: jurisdiction,
            }
          })
      )
    })

    return Promise.all(actions).then((responses) => {
      const items = []

      responses.forEach((result) => {
        const respItems = result.response.data.items

        this.log(`Retrieved ${respItems.length} listings from [${result.jurisdiction.name}]`)

        respItems.forEach((listing) => {
          items.push(listing)
        })
      })

      this.log(
        `Extract Results: ${items.length} listings fetched from ${jurisdictions.length} jurisdictions`
      )

      return items
    })
  }
}
