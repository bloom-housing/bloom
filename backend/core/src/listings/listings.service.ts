import { Injectable } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import { ListingCreateDto, ListingUpdateDto } from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ListingsListQueryParams } from "./listings.controller"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly repository: Repository<Listing>) {}

  private getQueryBuilder() {
    return this.repository
      .createQueryBuilder("listings")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.amiChart", "amiChart")
  }

  public async list(params: ListingsListQueryParams): Promise<Listing[]> {
    const query = this.getQueryBuilder().orderBy({
      "listings.id": "DESC",
      "units.maxOccupancy": "ASC",
      "preferences.ordinal": "ASC",
    })

    if (params.neighborhood) {
      // This works because there's only one property per listing. If that
      // weren't true for a field (for example, if we filtered on a unit's
      // fields), we couldn't use this type of where clause.
      query.andWhere("property.neighborhood = :neighborhood", { neighborhood: params.neighborhood })
    }

    let listings = await query.getMany()

    if (params.jsonpath) {
      listings = jp.query(listings, params.jsonpath)
    }
    return listings
  }

  async create(listingDto: ListingCreateDto) {
    return this.repository.save(listingDto)
  }

  async update(listingDto: ListingUpdateDto) {
    const listing = await this.repository.findOneOrFail({
      where: { id: listingDto.id },
      relations: ["property"],
    })
    /*
      NOTE: Object.assign would replace listing.property of type Property with object of type IdDto
       coming from ListingUpdateDto, which is causing a problem for dynamically computed
       listingUrlSlug property (it requires property.buildingAddress.city to exist). The solution is
       to assign this separately so that other properties (outside of IdDto type) of
       listing.property are retained.
    */
    const { property, ...dto } = listingDto
    Object.assign(listing, dto)
    Object.assign(listing.property, property)
    return await listing.save()
  }

  async delete(listingId: string) {
    const listing = await this.repository.findOneOrFail({
      where: { id: listingId },
    })
    return await this.repository.remove(listing)
  }

  async findOne(listingId: string) {
    return await this.getQueryBuilder()
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "preferences.ordinal": "ASC",
      })
      .getOne()
  }
}
