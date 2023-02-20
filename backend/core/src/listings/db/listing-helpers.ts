import { Listing } from "../entities/listing.entity"
import { ListingsQueryBuilder } from "./listing-query-builder"
import { Repository } from "typeorm"

export const createQueryBuilder = (
  listingRepository: Repository<Listing>,
  alias: string
): ListingsQueryBuilder => {
  return new ListingsQueryBuilder(listingRepository.createQueryBuilder(alias))
}

export const getJurisdictionIdByListingId = async (
  listingRepository: Repository<Listing>,
  listingId: string | null
): Promise<string | null> => {
  if (!listingId) {
    return null
  }

  const listing = await createQueryBuilder(listingRepository, "listings")
    .where(`listings.id = :listingId`, { listingId })
    .leftJoin("listings.jurisdiction", "jurisdiction")
    .select(["listings.id", "jurisdiction.id"])
    .getOne()

  return listing.jurisdiction.id
}
