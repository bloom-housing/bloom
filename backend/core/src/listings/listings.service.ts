import { Injectable, NotFoundException } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import { ListingCreateDto, ListingUpdateDto, ListingFilterParams } from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { addFilter } from "../shared/filter"
import { plainToClass } from "class-transformer"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { arrayIndex } from "../libs/arrayLib"
import { Translate } from "@google-cloud/translate/build/src/v2"
import { Language } from "../../types"

const TRANSLATION_KEYS = [
  "applicationPickUpAddressOfficeHours",
  "costsNotIncluded",
  "creditHistory",
  "criminalBackground",
  "programRules",
  "rentalAssistance",
  "rentalHistory",
  "requiredDocuments",
  "specialNotes",
  {
    property: [
      "accessibility",
      "amenities",
      "petPolicy",
      "servicesOffered",
      "smokingPolicy",
      "unitAmenities",
    ],
    whatToExpect: ["applicantsWillBeContacted", "allInfoWillBeVerified", "bePreparedIfChosen"],
    preferences: ["title", "description"],
  },
]
@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly listingRepository: Repository<Listing>) {}

  private getQueryBuilder() {
    return Listing.createQueryBuilder("listings")
      .leftJoinAndSelect("listings.applicationMethods", "applicationMethods")
      .leftJoinAndSelect("applicationMethods.paperApplications", "paperApplications")
      .leftJoinAndSelect("paperApplications.file", "paperApplicationFile")
      .leftJoinAndSelect("listings.image", "image")
      .leftJoinAndSelect("listings.events", "listingEvents")
      .leftJoinAndSelect("listingEvents.file", "listingEventFile")
      .leftJoinAndSelect("listings.result", "result")
      .leftJoinAndSelect("listings.applicationAddress", "applicationAddress")
      .leftJoinAndSelect("listings.leasingAgentAddress", "leasingAgentAddress")
      .leftJoinAndSelect("listings.applicationPickUpAddress", "applicationPickUpAddress")
      .leftJoinAndSelect("listings.applicationMailingAddress", "applicationMailingAddress")
      .leftJoinAndSelect("listings.applicationDropOffAddress", "applicationDropOffAddress")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.unitType", "unitTypeRef")
      .leftJoinAndSelect("units.unitRentType", "unitRentType")
      .leftJoinAndSelect("units.priorityType", "priorityType")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .leftJoinAndSelect("listings.jurisdiction", "jurisdiction")
      .leftJoinAndSelect("listings.reservedCommunityType", "reservedCommunityType")
  }

  public async list(
    origin: string,
    jsonpath?: string,
    filter?: ListingFilterParams[]
  ): Promise<Listing[]> {
    const qb = this.getQueryBuilder()
    if (filter) {
      addFilter<ListingFilterParams>(filter, "listings", qb)
    }

    qb.orderBy({
      "listings.id": "DESC",
      "units.max_occupancy": "ASC",
      "preferences.ordinal": "ASC",
    })

    let listings = await qb.getMany()

    /**
     * Get the application counts and map them to listings
     */
    if (origin === process.env.PARTNERS_BASE_URL) {
      const counts = await Listing.createQueryBuilder("listing")
        .select("listing.id")
        .loadRelationCountAndMap("listing.applicationCount", "listing.applications", "applications")
        .getMany()

      const countIndex = arrayIndex<Listing>(counts, "id")

      listings.forEach((listing: Listing) => {
        listing.applicationCount = countIndex[listing.id].applicationCount || 0
      })
    }

    if (jsonpath) {
      listings = jp.query(listings, jsonpath)
    }
    return listings
  }

  async create(listingDto: ListingCreateDto) {
    const listing = Listing.create({
      ...listingDto,
      property: plainToClass(PropertyCreateDto, listingDto),
    })
    return await listing.save()
  }

  async update(listingDto: ListingUpdateDto) {
    const qb = this.getQueryBuilder()
    qb.where("listings.id = :id", { id: listingDto.id })
    const listing = await qb.getOne()

    if (!listing) {
      throw new NotFoundException()
    }
    listingDto.units.forEach((unit) => {
      if (unit.id.length === 0 || unit.id === "undefined") {
        delete unit.id
      }
    })
    Object.assign(listing, {
      ...plainToClass(Listing, listingDto, { excludeExtraneousValues: true }),
      property: plainToClass(
        PropertyUpdateDto,
        {
          // NOTE: Create a property out of fields encapsulated in listingDto
          ...listingDto,
          // NOTE: Since we use the entire listingDto to create a property object the listing ID
          //  would overwrite propertyId fetched from DB
          id: listing.property.id,
        },
        { excludeExtraneousValues: true }
      ),
    })

    return await this.listingRepository.save(listing)
  }

  async delete(listingId: string) {
    const listing = await Listing.findOneOrFail({
      where: { id: listingId },
    })
    return await Listing.remove(listing)
  }

  async findOne(listingId: string, lang: Language = Language.en) {
    const result = await this.getQueryBuilder()
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "preferences.ordinal": "ASC",
      })
      .getOne()
    if (!result) {
      throw new NotFoundException()
    }
    if (lang !== Language.en) {
      // Get key-value pairs from listing to be translated
      const translations = this.getTranslations(result)

      const translatedValues = await this.translateService().translate(translations.values, {
        from: Language.en,
        to: lang,
      })
      // Attach translated values to the listing
      translations.keys.forEach((key, index) => {
        this.setValue(result, key, translatedValues[0][index])
      })
    }

    return result
  }

  private translateService = () => {
    return new Translate({
      credentials: {
        private_key: process.env.GOOGLE_API_KEY.replace(/\\n/gm, "\n"),
        client_email: process.env.GOOGLE_API_EMAIL,
      },
      projectId: process.env.GOOGLE_API_ID,
    })
  }
  // Sets value to the object by string path. eg. "property.accessibility" or "preferences.0.title"
  private setValue = (object, path, value) =>
    path
      .split(".")
      .reduce((o, p, i) => (o[p] = path.split(".").length === ++i ? value : o[p] || {}), object)

  // Returns not null key-values pairs also from nested properties
  private findData = (keys, object, results, parent = null) => {
    keys.forEach((key) => {
      if (typeof key === "string") {
        if (Array.isArray(object)) {
          object.forEach((value, i) => {
            results.keys.push(parent ? [parent, i, key].join(".") : key)
            results.values.push(value[key])
          })
        } else {
          if (object[key]) {
            results.keys.push(parent ? [parent, key].join(".") : key)
            results.values.push(object[key])
          }
        }
        return
      } else {
        for (const k in key) {
          if (object[k]) {
            this.findData(key[k], object[k], results, k)
          }
        }
      }
    })
  }
  private getTranslations = (listing: Listing) => {
    const result = { keys: [], values: [] }
    this.findData(TRANSLATION_KEYS, listing, result)
    return result
  }
}
