import Listing from "../entities/listing.entity"
import { OrderByFieldsEnum } from "../types/listing-orderby-enum"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ListingFilterParams } from "../dto/listing-filter-params"
import { addFilters } from "../../shared/query-filter"
import { filterTypeToFieldMap } from "../dto/filter-type-to-field-map"
import { GenericQueryBuilder } from "../../shared/db/generic-query-builder"

export class ListingsQueryBuilder extends GenericQueryBuilder<Listing> {
  public leftJoinRelationsForFilters() {
    return this.leftJoin(`${this.alias}.jurisdiction`, "jurisdiction")
      .leftJoin(`${this.alias}.leasingAgents`, "leasingAgents")
      .leftJoin(`${this.alias}.buildingAddress`, "buildingAddress")
      .leftJoin(`${this.alias}.units`, "units")
      .leftJoin("units.unitType", "unitTypeRef")
  }

  public leftJoinAndSelectAll() {
    return this.leftJoinAndSelect(`${this.alias}.applicationMethods`, "applicationMethods")
      .leftJoinAndSelect("applicationMethods.paperApplications", "paperApplications")
      .leftJoinAndSelect("paperApplications.file", "paperApplicationFile")
      .leftJoinAndSelect(`${this.alias}.image`, "image")
      .leftJoinAndSelect(
        `${this.alias}.buildingSelectionCriteriaFile`,
        "buildingSelectionCriteriaFile"
      )
      .leftJoinAndSelect(`${this.alias}.events`, "listingEvents")
      .leftJoinAndSelect("listingEvents.file", "listingEventFile")
      .leftJoinAndSelect(`${this.alias}.result`, "result")
      .leftJoinAndSelect(`${this.alias}.leasingAgentAddress`, "leasingAgentAddress")
      .leftJoinAndSelect(`${this.alias}.applicationPickUpAddress`, "applicationPickUpAddress")
      .leftJoinAndSelect(`${this.alias}.applicationMailingAddress`, "applicationMailingAddress")
      .leftJoinAndSelect(`${this.alias}.applicationDropOffAddress`, "applicationDropOffAddress")
      .leftJoinAndSelect(`${this.alias}.leasingAgents`, "leasingAgents")
      .leftJoinAndSelect(`${this.alias}.listingPreferences`, "listingPreferences")
      .leftJoinAndSelect("listingPreferences.preference", "listingPreferencesPreference")
      .leftJoinAndSelect(`${this.alias}.buildingAddress`, "buildingAddress")
      .leftJoinAndSelect(`${this.alias}.units`, "units")
      .leftJoinAndSelect("units.amiChartOverride", "amiChartOverride")
      .leftJoinAndSelect("units.unitType", "unitTypeRef")
      .leftJoinAndSelect("units.unitRentType", "unitRentType")
      .leftJoinAndSelect("units.priorityType", "priorityType")
      .leftJoinAndSelect(`${this.alias}.jurisdiction`, "jurisdiction")
      .leftJoinAndSelect(`${this.alias}.reservedCommunityType`, "reservedCommunityType")
      .leftJoinAndSelect(`${this.alias}.listingPrograms`, "listingPrograms")
      .leftJoinAndSelect("listingPrograms.program", "listingProgramsProgram")
  }

  addFilters(filters?: ListingFilterParams[]) {
    if (!filters) {
      return this
    }
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
        return this.orderBy({ [`${this.alias}.updatedAt`]: "DESC" })
      case OrderByFieldsEnum.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return this.orderBy({
          [`${this.alias}.applicationDueDate`]: "ASC",
          [`${this.alias}.applicationOpenDate`]: "DESC",
          [`${this.alias}.id`]: "ASC"
        })
      default:
        throw new HttpException(
          `OrderBy parameter not recognized or not yet implemented.`,
          HttpStatus.NOT_IMPLEMENTED
        )
    }
  }
}
