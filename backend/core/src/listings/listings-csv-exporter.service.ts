import { Injectable, Scope } from "@nestjs/common"
import { CsvBuilder } from "../applications/services/csv-builder.service"
import {
  cloudinaryPdfFromId,
  formatCurrency,
  formatRange,
  formatRentRange,
  formatStatus,
  formatYesNo,
  getRentTypes,
  convertToTitleCase,
  formatBedroom,
  getPaperAppUrls,
} from "./helpers"
import { formatLocalDate } from "../shared/utils/format-local-date"
@Injectable({ scope: Scope.REQUEST })
export class ListingsCsvExporterService {
  constructor(private readonly csvBuilder: CsvBuilder) {}

  exportListingsFromObject(listings: any[], users: any[], timeZone: string): string {
    // restructure user information to listingId->user rather than user->listingId
    const partnerAccessHelper = {}
    users.forEach((user) => {
      const userName = `${user.firstName} ${user.lastName}`
      user.leasingAgentInListings.forEach((listing) => {
        partnerAccessHelper[listing.id]
          ? partnerAccessHelper[listing.id].push(userName)
          : (partnerAccessHelper[listing.id] = [userName])
      })
    })
    const listingObj = listings.map((listing) => {
      return {
        ID: listing.id,
        "Created At Date": formatLocalDate(listing.createdAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        "Listing Status": formatStatus[listing.status],
        "Publish Date": formatLocalDate(listing.publishedAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        Verified: formatYesNo(listing.isVerified),
        "Verified Date": formatLocalDate(listing.verifiedAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        "Last Updated": formatLocalDate(listing.updatedAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        "Listing Name": listing.name,
        "Developer/Property Owner": listing.property.developer,
        "Street Address": listing.property.buildingAddress?.street,
        City: listing.property.buildingAddress?.city,
        State: listing.property.buildingAddress?.state,
        Zip: listing.property.buildingAddress?.zipCode,
        "Year Built": listing.property.yearBuilt,
        Neighborhood: listing.property.neighborhood,
        Region: listing.property.region,
        Latitude: listing.property.buildingAddress?.latitude,
        Longitude: listing.property.buildingAddress?.longitude,
        "Home Type": convertToTitleCase(listing.homeType),
        "Accept Section 8": formatYesNo(listing.section8Acceptance),
        "Number Of Unit Groups": listing.unitGroups?.length,
        "Community Types": listing.listingPrograms
          ?.map((listingProgram) => listingProgram.program.title)
          .join(", "),
        "Application Fee": formatCurrency(listing.applicationFee),
        "Deposit Min": formatCurrency(listing.depositMin),
        "Deposit Max": formatCurrency(listing.depositMax),
        "Deposit Helper": listing.depositHelperText,
        "Costs Not Included": listing.costsNotIncluded,
        "Utilities Included": Object.entries(listing.utilities ?? {})
          .filter((entry) => entry[1] === true)
          .map((entry) => convertToTitleCase(entry[0]))
          .join(", "),
        "Property Amenities": listing.property.amenities,
        "Additional Accessibility Details": listing.property.accessibility,
        "Unit Amenities": listing.property.unitAmenities,
        "Smoking Policy": listing.property.smokingPolicy,
        "Pets Policy": listing.property.petPolicy,
        "Services Offered": listing.property.servicesOffered,
        "Accessibility Features": Object.entries(listing.features ?? {})
          ?.filter((entry) => entry[1] === true)
          .map((entry) => convertToTitleCase(entry[0]))
          .join(", "),
        "Grocery Stores": listing.neighborhoodAmenities?.groceryStores,
        "Public Transportation": listing.neighborhoodAmenities?.publicTransportation,
        Schools: listing.neighborhoodAmenities?.schools,
        "Parks and Community Centers": listing.neighborhoodAmenities?.parksAndCommunityCenters,
        Pharmacies: listing.neighborhoodAmenities?.pharmacies,
        "Health Care Resources": listing.neighborhoodAmenities?.healthCareResources,
        "Credit History": listing.creditHistory,
        "Rental History": listing.rentalHistory,
        "Criminal Background": listing.criminalBackground,
        "Building Selection Criteria": cloudinaryPdfFromId(
          listing.buildingSelectionCriteriaFile?.fileId
        ),
        "Required Documents": listing.requiredDocuments,
        "Important Program Rules": listing.programRules,
        "Special Notes": listing.specialNotes,
        "Review Order": convertToTitleCase(listing.reviewOrderType),
        "Lottery Date": formatLocalDate(listing.events[0]?.startTime, "MM-DD-YYYY", timeZone),
        "Lottery Start": formatLocalDate(listing.events[0]?.startTime, "hh:mmA z", timeZone),
        "Lottery End": formatLocalDate(listing.events[0]?.endTime, "hh:mmA z", timeZone),
        "Lottery Notes": listing.events[0]?.note,
        Waitlist: formatYesNo(listing.isWaitlistOpen),
        "Max Waitlist Size": listing.waitlistMaxSize,
        "How many people on the current list": listing.waitlistCurrentSize,
        "How many open spots on the waitlist": listing.waitlistOpenSpots,
        "Marketing Status": convertToTitleCase(listing.marketingType),
        "Marketing Season": convertToTitleCase(listing.marketingSeason),
        "Marketing Date": formatLocalDate(listing.marketingDate, "YYYY"),
        "Leasing Company": listing.leasingAgentName,
        "Leasing Email": listing.leasingAgentEmail,
        "Leasing Phone": listing.leasingAgentPhone,
        "Leasing Agent Title": listing.leasingAgentTitle,
        "Leasing Agent Company Hours": listing.leasingAgentOfficeHours,
        "Leasing Agency Website": listing.managementWebsite,
        "Leasing Agency Street Address": listing.leasingAgentAddress?.street,
        "Leasing Agency Street 2": listing.leasingAgentAddress?.street2,
        "Leasing Agency City": listing.leasingAgentAddress?.city,
        "Leasing Agency Zip": listing.leasingAgentAddress?.zipCode,
        "Leasing Agency Mailing Address": listing.applicationMailingAddress?.street,
        "Leasing Agency Mailing Address Street 2": listing.applicationMailingAddress?.street2,
        "Leasing Agency Mailing Address City": listing.applicationMailingAddress?.city,
        "Leasing Agency Mailing Address Zip": listing.applicationMailingAddress?.zipCode,
        "Leasing Agency Pickup Address": listing.applicationPickUpAddress?.street,
        "Leasing Agency Pickup Address Street 2": listing.applicationPickUpAddress?.street2,
        "Leasing Agency Pickup Address City": listing.applicationPickUpAddress?.city,
        "Leasing Agency Pickup Address Zip": listing.applicationPickUpAddress?.zipCode,
        "Leasing Pick Up Office Hours": listing.applicationPickUpAddressOfficeHours,
        Postmark: formatLocalDate(
          listing.postmarkedApplicationsReceivedByDate,
          "MM-DD-YYYY hh:mm:ssA z",
          timeZone
        ),
        "Digital Application": formatYesNo(listing.digitalApplication),
        "Digital Application URL": listing.applicationMethods[1]?.externalReference,
        "Paper Application": formatYesNo(listing.paperApplication),
        "Paper Application URL": getPaperAppUrls(listing.applicationMethods[0]?.paperApplications),
        "Partners Who Have Access": partnerAccessHelper[listing.id]?.join(", "),
      }
    })
    return this.csvBuilder.buildFromIdIndex(listingObj)
  }

  exportUnitsFromObject(listings: any[]): string {
    const reformattedListings = []
    listings.forEach((listing) => {
      listing.unitGroups.forEach((unitGroup, idx) => {
        reformattedListings.push({
          id: listing.id,
          name: listing.name,
          unitGroup,
          unitGroupSummary: listing.unitSummaries.unitGroupSummary[idx],
        })
      })
    })

    const unitsFormatted = reformattedListings.map((listing) => {
      return {
        "Listing ID": listing.id,
        "Listing Name": listing.name,
        "Unit Group ID": listing.unitGroup.id,
        "Unit Types": listing.unitGroupSummary?.unitTypes
          .map((unitType) => formatBedroom[unitType])
          .join(", "),
        "AMI Chart": [
          ...new Set(listing.unitGroup?.amiLevels.map((level) => level.amiChart?.name)),
        ].join(", "),
        "AMI Level": formatRange(
          listing.unitGroupSummary?.amiPercentageRange?.min,
          listing.unitGroupSummary?.amiPercentageRange?.max,
          "",
          "%"
        ),
        "Rent Type": getRentTypes(listing.unitGroup?.amiLevels),
        "Monthly Rent": formatRentRange(
          listing.unitGroupSummary.rentRange,
          listing.unitGroupSummary.rentAsPercentIncomeRange
        ),
        "Affordable Unit Group Quantity": listing.unitGroup?.totalCount,
        "Unit Group Vacancies": listing.unitGroup?.totalAvailable,
        "Waitlist Status": formatYesNo(listing.unitGroup?.openWaitlist),
        "Minimum Occupancy": listing.unitGroup?.minOccupancy,
        "Maximum Occupancy": listing.unitGroup?.maxOccupancy,
        "Minimum Sq ft": listing.unitGroup?.sqFeetMin,
        "Maximum Sq ft": listing.unitGroup?.sqFeetMax,
        "Minimum Floor": listing.unitGroup?.floorMin,
        "Maximum Floor": listing.unitGroup?.floorMax,
        "Minimum Bathrooms": listing.unitGroup?.bathroomMin,
        "Maximum Bathrooms": listing.unitGroup?.bathroomMax,
      }
    })
    return this.csvBuilder.buildFromIdIndex(unitsFormatted)
  }
}
