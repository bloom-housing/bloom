import Listing from "../entities/listing.entity"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ListingFilterParams } from "../dto/listing-filter-params"
import { addFilters } from "../../shared/query-filter"
import { filterTypeToFieldMap } from "../dto/filter-type-to-field-map"
import { GenericQueryBuilder } from "../../shared/db/generic-query-builder"

export class ListingsQueryBuilder extends GenericQueryBuilder<Listing> {
  public leftJoinRelationsForFilters() {
    return this
      .leftJoin(`listings.property`, "property")
      .leftJoin("listings.leasingAgents", "leasingAgents")
      .leftJoin("property.buildingAddress", "buildingAddress")
      .leftJoin("property.units", "units")
      .leftJoin("units.unitType", "unitTypeRef")
  }

  public leftJoinAndSelectAll() {
    return this
      .leftJoinAndSelect("listings.applicationMethods", "applicationMethods")
      .leftJoinAndSelect("applicationMethods.paperApplications", "paperApplications")
      .leftJoinAndSelect("paperApplications.file", "paperApplicationFile")
      .leftJoinAndSelect("listings.image", "image")
      .leftJoinAndSelect("listings.buildingSelectionCriteriaFile", "buildingSelectionCriteriaFile")
      .leftJoinAndSelect("listings.events", "listingEvents")
      .leftJoinAndSelect("listingEvents.file", "listingEventFile")
      .leftJoinAndSelect("listings.result", "result")
      .leftJoinAndSelect("listings.leasingAgentAddress", "leasingAgentAddress")
      .leftJoinAndSelect("listings.applicationPickUpAddress", "applicationPickUpAddress")
      .leftJoinAndSelect("listings.applicationMailingAddress", "applicationMailingAddress")
      .leftJoinAndSelect("listings.applicationDropOffAddress", "applicationDropOffAddress")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.listingPreferences", "listingPreferences")
      .leftJoinAndSelect("listingPreferences.preference", "listingPreferencesPreference")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.amiChartOverride", "amiChartOverride")
      .leftJoinAndSelect("units.unitType", "unitTypeRef")
      .leftJoinAndSelect("units.unitRentType", "unitRentType")
      .leftJoinAndSelect("units.priorityType", "priorityType")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .leftJoinAndSelect("listings.jurisdiction", "jurisdiction")
      .leftJoinAndSelect("listings.reservedCommunityType", "reservedCommunityType")
      .leftJoinAndSelect("listings.listingPrograms", "listingPrograms")
      .leftJoinAndSelect("listingPrograms.program", "listingProgramsProgram")
  }

  addFilters(filters?: ListingFilterParams[]) {
    if (!filters) return this
    addFilters<Array<ListingFilterParams>, typeof filterTypeToFieldMap>(
      filters,
      filterTypeToFieldMap,
      this
    )
    return this
  }

  public addOrderFromFieldEnum(orderBy: OrderByFieldsEnum) {
    switch (orderBy) {
      case OrderByFieldsEnum.mostRecentlyUpdated:
        return this.orderBy({ "listings.updated_at": "DESC" })
      case OrderByFieldsEnum.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return this.orderBy({
          "listings.applicationDueDate": "ASC",
          "listings.applicationOpenDate": "DESC",
          "listings.id": "ASC"
        })
      default:
        throw new HttpException(
          `OrderBy parameter not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
  }

  public addDefaultOrderBy() {
    return this.addOrderBy("listingPreferences.ordinal", "ASC")
  }
}
