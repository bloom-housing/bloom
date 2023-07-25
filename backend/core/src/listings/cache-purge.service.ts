import { HttpService } from "@nestjs/axios"
import { firstValueFrom } from "rxjs"
import { Listing } from "./entities/listing.entity"
import { ListingCreateDto } from "./dto/listing-create.dto"
import { ListingUpdateDto } from "./dto/listing-update.dto"
import { ListingStatus } from "./types/listing-status-enum"
import { Injectable } from "@nestjs/common"

@Injectable()
export class CachePurgeService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Send purge request to Nginx.
   * Wrapped in try catch, because it's possible that content may not be cached in between edits,
   * and will return a 404, which is expected.
   * listings* purges all /listings locations (with args, details), so if we decide to clear on certain locations,
   * like all lists and only the edited listing, then we can do that here (with a corresponding update to nginx config)
   */
  public async cachePurgeForSingleListing(
    currentListing: Listing,
    incomingChanges: ListingCreateDto | ListingUpdateDto,
    saveReponse: Listing
  ) {
    if (process.env.PROXY_URL) {
      await firstValueFrom(
        this.httpService.request({
          baseURL: process.env.PROXY_URL,
          method: "PURGE",
          url: `/listings/${saveReponse.id}*`,
        })
      ).catch((e) => console.log(`purge listing ${saveReponse.id} error = `, e))
      if (
        incomingChanges.status !== ListingStatus.pending ||
        currentListing.status === ListingStatus.active
      ) {
        await this.cachePurgeListings()
      }
    }
  }

  public async cachePurgeListings() {
    if (process.env.PROXY_URL) {
      await firstValueFrom(
        this.httpService.request({
          baseURL: process.env.PROXY_URL,
          method: "PURGE",
          url: "/listings?*",
        })
      ).catch((e) => console.log("purge all listings error = ", e))
    }
  }
}
