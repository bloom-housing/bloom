import Listing from "../entities/listing.entity"
import { EntityRepository } from "typeorm"
import { ListingsQueryBuilder } from "./listing-query-builder"
import { GenericRepository } from "../../shared/db/generic.repository"

@EntityRepository(Listing)
export class ListingRepository extends GenericRepository<Listing> {
  public async getJurisdictionIdByListingId(listingId: string | null): Promise<string | null> {
    if (!listingId) {
      return null
    }

    const listing = await this.createQueryBuilder("listings")
      .where(`listings.id = :listingId`, { listingId })
      .leftJoin("listings.jurisdiction", "jurisdiction")
      .select(["listings.id", "jurisdiction.id"])
      .getOne()

    return listing.jurisdiction.id
  }

  public createQueryBuilder(alias: string): ListingsQueryBuilder {
    return new ListingsQueryBuilder(super.createQueryBuilder(alias))
  }
}
