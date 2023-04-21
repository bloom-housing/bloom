import { Listing } from "../entities/listing.entity"
import { EntityRepository, Repository } from "typeorm"
import { ListingsQueryBuilder } from "./listing-query-builder"
import { CombinedListingsQueryBuilder } from "../combined/combined-listing-query-builder"

@EntityRepository(Listing)
export class ListingRepository extends Repository<Listing> {
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

  public createCombinedListingsQueryBuilder(alias: string): CombinedListingsQueryBuilder {
    const conn = this.manager.connection

    const qb = conn.createQueryBuilder().select().from("combined_listings", alias)

    return new CombinedListingsQueryBuilder(qb)
  }
}
