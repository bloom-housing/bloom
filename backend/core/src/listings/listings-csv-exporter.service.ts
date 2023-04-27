import { Injectable, Scope } from "@nestjs/common"
import { CsvBuilder } from "../applications/services/csv-builder.service"
import {
  cloudinaryPdfFromId,
  formatCurrency,
  formatRange,
  formatRentRange,
  formatStatus,
  formatYesNo,
  convertToTitleCase,
  getPaperAppUrls,
  formatUnitType,
  formatCommunityType,
} from "./helpers"
import { formatLocalDate } from "../shared/utils/format-local-date"
import { ListingReviewOrder } from "./types/listing-review-order-enum"
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
      const programsFormatted = []
      const preferencesFormatted = []
      listing.listingMultiselectQuestions?.forEach((question) => {
        const questionInfo = question.multiselectQuestion
        if (questionInfo?.applicationSection === "preferences")
          preferencesFormatted.push(questionInfo?.text)
        else if (questionInfo?.applicationSection === "programs")
          programsFormatted.push(questionInfo?.text)
      })

      const openHouse = []
      const lottery = []
      listing.listingEvents?.forEach((event) => {
        if (event.type === "openHouse") {
          openHouse.push(event)
        } else if (event.type === "publicLottery") {
          lottery.push(event)
        }
      })

      return {
        ID: listing.id,
        "Created At Date": formatLocalDate(listing.createdAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        Jurisdiction: listing.jurisdiction.name,
        "Listing Name": listing.name,
        "Listing Status": formatStatus[listing.status],
        "Publish Date": formatLocalDate(listing.publishedAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        "Last Updated": formatLocalDate(listing.updatedAt, "MM-DD-YYYY hh:mm:ssA z", timeZone),
        Developer: listing.developer,
        "Building Street Address": listing.buildingAddress?.street,
        "Building City": listing.buildingAddress?.city,
        "Building State": listing.buildingAddress?.state,
        "Building Zip": listing.buildingAddress?.zipCode,
        "Building Year Built": listing.yearBuilt,
        "Reserved Community Types": formatCommunityType[listing.reservedCommunityType?.name],
        Latitude: listing.buildingAddress?.latitude,
        Longitude: listing.buildingAddress?.longitude,
        "Number of units": listing.numberOfUnits,
        "Listing Availability":
          listing?.reviewOrderType === ListingReviewOrder.waitlist
            ? "Open Waitlist"
            : "Available Units",
        "Important Program Rules": listing.programRules,
        "Review Order": convertToTitleCase(listing.reviewOrderType),
        "Lottery Date": formatLocalDate(listing.events[0]?.startTime, "MM-DD-YYYY", timeZone),
        "Lottery Start": formatLocalDate(listing.events[0]?.startTime, "hh:mmA z", timeZone),
        "Lottery End": formatLocalDate(listing.events[0]?.endTime, "hh:mmA z", timeZone),
        "Lottery Notes": listing.events[0]?.note,
        "Housing Preferences": preferencesFormatted.join(", "),
        "Housing Programs": programsFormatted.join(", "),
        "Application Fee": formatCurrency(listing.applicationFee),
        "Deposit Helper Text": listing.depositHelperText,
        "Deposit Min": formatCurrency(listing.depositMin),
        "Deposit Max": formatCurrency(listing.depositMax),
        "Costs Not Included": listing.costsNotIncluded,
        "Property Amenities": listing.amenities,
        "Additional Accessibility": listing.accessibility,
        "Unit Amenities": listing.unitAmenities,
        "Smoking Policy": listing.smokingPolicy,
        "Pets Policy": listing.petPolicy,
        "Services Offered": listing.servicesOffered,
        "Eligibility Rules - Credit History": listing.creditHistory,
        "Eligibility Rules - Rental History": listing.rentalHistory,
        "Eligibility Rules - Criminal Background": listing.criminalBackground,
        "Eligibility Rules - Rental Assistance": listing.rentalAssistance,
        "Building Selection Criteria":
          listing.buildingSelectionCriteria ??
          cloudinaryPdfFromId(listing.buildingSelectionCriteriaFile?.fileId),
        "Required Documents": listing.requiredDocuments,
        "Special Notes": listing.specialNotes,
        Waitlist: formatYesNo(listing.isWaitlistOpen),
        "Max Waitlist Size": listing.waitlistMaxSize,
        "Leasing Agent Name": listing.leasingAgentName,
        "Leasing Agent Email": listing.leasingAgentEmail,
        "Leasing Agent Phone": listing.leasingAgentPhone,
        "Leasing Agent Title": listing.leasingAgentTitle,
        "Leasing Agent Office Hours": listing.leasingAgentOfficeHours,
        "Leasing Agent Street Address": listing.leasingAgentAddress?.street,
        "Leasing Agent Apt/Unit #": listing.leasingAgentAddress?.street2,
        "Leasing Agent City": listing.leasingAgentAddress?.city,
        "Leasing Agent Zip": listing.leasingAgentAddress?.zipCode,
        "Leasing Agency Mailing Address": listing.applicationMailingAddress?.street,
        "Leasing Agency Mailing Address Street 2": listing.applicationMailingAddress?.street2,
        "Leasing Agency Mailing Address City": listing.applicationMailingAddress?.city,
        "Leasing Agency Mailing Address Zip": listing.applicationMailingAddress?.zipCode,
        "Leasing Agency Pickup Address": listing.applicationPickUpAddress?.street,
        "Leasing Agency Pickup Address Street 2": listing.applicationPickUpAddress?.street2,
        "Leasing Agency Pickup Address City": listing.applicationPickUpAddress?.city,
        "Leasing Agency Pickup Address Zip": listing.applicationPickUpAddress?.zipCode,
        "Leasing Pick Up Office Hours": listing.applicationPickUpAddressOfficeHours,
        "Digital Application": formatYesNo(listing.digitalApplication),
        "Digital Application URL": listing.applicationMethods[1]?.externalReference,
        "Paper Application": formatYesNo(listing.paperApplication),
        "Paper Application URL": getPaperAppUrls(listing.applicationMethods[0]?.paperApplications),
        "Referral opportunity?": formatYesNo(listing.referralOpportunity),
        "Can applications be mailed in?": formatYesNo(
          listing.applicationMailingAddress || listing.applicationMailingAddressType
        ),
        "Can applications be picked up?": formatYesNo(
          listing.applicationPickUpAddress || listing?.applicationPickUpAddressType
        ),
        "Can applications be dropped off?": formatYesNo(
          listing.applicationPickUpAddress || listing?.applicationPickUpAddressType
        ),
        "Are postmarks considered?": formatYesNo(
          listing.applicationMethods?.acceptsPostmarkedApplications
        ),
        "Additional Application Submission Notes": listing.additionalApplicationSubmissionNotes,
        "Application Due Date": formatLocalDate(listing.applicationDueDate, "MM-DD-YYYY", timeZone),
        "Application Due Time": formatLocalDate(listing.applicationDueDate, "hh:mmA z", timeZone),
        "Open House Date": "",
        "Open House Start Time": "",
        "Open House End Time": "",
        "	Open House Label": "",
        "Open House URL": "",
        "Open House Notes": "",
        "Partners Who Have Access": partnerAccessHelper[listing.id]?.join(", "),
      }
    })
    return this.csvBuilder.buildFromIdIndex(listingObj)
  }

  exportUnitsFromObject(listings: any[]): string {
    const reformattedListings = []
    listings.forEach((listing) => {
      listing.units?.forEach((unit) => {
        reformattedListings.push({
          id: listing.id,
          name: listing.name,
          unit,
        })
      })
    })
    const unitsFormatted = reformattedListings.map((listing) => {
      if (listing.name === "Test: Coliseum") console.log(listing.unit?.amiChart?.items)
      return {
        "Listing ID": listing.id,
        "Listing Name": listing.name,
        "Unit Number": listing.unit?.number,
        "Unit Type": formatUnitType[listing.unit?.unitType?.name],
        "Number of Bathrooms": listing.unit?.numBathrooms,
        "Unit Floor": listing.unit?.floor,
        "Square footage": listing.unit?.sqFeet,
        "Minimum Occupancy": listing.unit?.minOccupancy,
        "Max Occupancy": listing.unit?.maxOccupancy,
        "AMI Chart": convertToTitleCase(listing.unit?.name),
        "AMI Level": listing.unit?.amiChart?.items[0]?.percentOfAmi,
        "Rent Type": listing.unit?.monthlyRentAsPercentOfIncome ? "% of income" : "Fixed amount",
        "Monthly Rent": listing.unit?.monthlyRentAsPercentOfIncome ?? listing.unit?.monthlyRent,
        "Minimum Income": listing.unit?.monthlyIncomeMin,
        "Accessibility Priority Type": listing.unit?.priorityType?.name,
      }
    })
    return this.csvBuilder.buildFromIdIndex(unitsFormatted)
  }
}
