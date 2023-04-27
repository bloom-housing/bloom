import { Axios } from "axios"
import { Jurisdiction, JurisdictionResponse, UrlInfo } from "../../types"
import { BaseStage } from "../base-stage"
import { JurisdictionResolverInterface } from "./jurisdiction-resolver-interface"

export class JurisdictionResolver extends BaseStage implements JurisdictionResolverInterface {
  axios: Axios
  urlInfo: UrlInfo
  jurisdictionIncludeList: Array<string>

  // This constructor uses dependency injection for axios to enable easier mocking
  constructor(axios: Axios, urlInfo: UrlInfo, jurisdictionIncludeList: Array<string>) {
    super()
    this.axios = axios
    this.urlInfo = urlInfo
    this.jurisdictionIncludeList = jurisdictionIncludeList
  }

  public async fetchJurisdictions(): Promise<Jurisdiction[]> {
    const endpoint = this.urlInfo.base + this.urlInfo.path

    return this.axios
      .get<JurisdictionResponse>(endpoint)
      .catch((error) => {
        this.logger.error("Unexpected HTTP error fetching jurisdictions")
        throw error
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          // map to explicit jurisdiction objects to shed unneeded props
          return response.data.map((obj) => {
            const j = new Jurisdiction()
            j.id = obj.id
            j.name = obj.name
            return j
          })
        }
      })
      .then((jurisdictions) => {
        this.log(`[${jurisdictions.length}] jurisdictions found`)

        // filter jurisdictions
        this.log(`Filtering jurisdictions`)
        const filteredJurisdictions = jurisdictions.filter((j) => {
          const inList = this.jurisdictionIncludeList.includes(j.name)

          if (inList) {
            this.log(`Jurisdiction [${j.name}] matches list with ID [${j.id}]`)
          } else {
            this.log(`Jurisdiction [${j.name}] is not in list; skipping`)
          }

          return inList
        })
        this.log(
          `[${filteredJurisdictions.length} of ${jurisdictions.length}] jurisdictions match include list`
        )

        return filteredJurisdictions
      })
  }
}
