import Listing from "../entities/listing.entity"
import { EntityRepository, Repository } from "typeorm"

@EntityRepository(Listing)
export class ListingRepository extends Repository<Listing> {
  public async getJurisdictionIdByListingId(listingId: string | null): Promise<string | null> {
    if (!listingId) {
      return null
    }

    const listing = await this.createQueryBuilder("listings")
      .where("listings.id = :listingId", {listingId})
      .leftJoin("listings.jurisdiction", "jurisdiction")
      .select(["listings.id", "jurisdiction.id"])
      .getOne()

    return listing.jurisdiction.id
  }
}
