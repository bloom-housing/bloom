import * as OldClient from "./old-client"
import * as NewClient from "./client"
import { ApplicationStatus, ApplicationSubmissionType, Language } from "./client"
import axios from "axios"

const oldClientConfig = {
  // baseURL: "https://listings-next.housingbayarea.org/",
  baseURL: "https://listings-next.housingbayarea.org",
  timeout: 5000,
}
OldClient.serviceOptions.axios = axios.create(oldClientConfig)

const newClientConfig = {
  baseURL: "http://localhost:3100",
  timeout: 5000,
}
NewClient.serviceOptions.axios = axios.create(newClientConfig)

const amiChartsKeyMappings = {
  1: "San Mateo HUD 2019",
  2: "San Mateo HOME 2019",
  3: "San Mateo HERA Special 2019",
  4: "San Jose TCAC 2019",
  5: "Alameda County TCAC 2019",
  6: "San Mateo County TCAC 2019",
  7: "San Mateo HUD 2020",
  8: "San Mateo County TCAC 2020",
  9: "Alameda County LIHTC 2020",
  10: "Oakland Fremont HUD 2020",
  11: "Alameda County TCAC 2020",
}
const newAmiChartsKeyMappings = {}

async function migrator() {
  const { accessToken: localAccessToken } = await new NewClient.AuthService().login({
    body: {
      email: "admin@example.com",
      password: "abcdef",
    },
  })
  const { accessToken: prodAccessToken } = await new OldClient.AuthService().login({
    body: {
      email: "ben.kutler@exygy.com",
      password: "Bloom2020!",
    },
  })

  NewClient.serviceOptions.axios = axios.create({
    ...newClientConfig,
    headers: {
      Authorization: `Bearer ${localAccessToken}`,
    },
  })

  OldClient.serviceOptions.axios = axios.create({
    ...oldClientConfig,
    headers: {
      Authorization: `Bearer ${prodAccessToken}`,
    },
  })

  const oldApplications = await new OldClient.ApplicationsService().list()

  const newApplicationsService = new NewClient.ApplicationsService()
  const oldListingsService = new OldClient.ListingsService()
  const { listings, amiCharts } = await oldListingsService.list()

  const newAmiChartsService = new NewClient.AmiChartsService()
  for (const [id, amiChartArray] of Object.entries(amiCharts)) {
    newAmiChartsKeyMappings[id] = await newAmiChartsService.create({
      body: {
        name: amiChartsKeyMappings[id],
        items: amiChartArray.map((amiChart) => {
          return {
            ...amiChart,
            income:
              typeof amiChart.income === "string" ? parseInt(amiChart.income) : amiChart.income,
            percentOfAmi:
              typeof amiChart.percentOfAmi === "string"
                ? parseInt(amiChart.percentOfAmi)
                : amiChart.percentOfAmi,
          }
        }),
      },
    })
  }

  for (const listing of listings) {
    const property = await new NewClient.PropertiesService().create({
      body: {
        ...listing,
        units: listing.units.map((unit) => {
          return {
            ...unit,
            amiChart: newAmiChartsKeyMappings[unit.amiChartId],
            sqFeet: (unit.sqFeet as unknown) as string,
            monthlyRentAsPercentOfIncome: (unit.monthlyRentAsPercentOfIncome as unknown) as string,
            floor: typeof unit.floor === "string" ? parseInt(unit.floor) : unit.floor,
            maxOccupancy:
              typeof unit.maxOccupancy === "string"
                ? parseInt(unit.maxOccupancy)
                : unit.maxOccupancy,
            minOccupancy:
              typeof unit.minOccupancy === "string"
                ? parseInt(unit.minOccupancy)
                : unit.minOccupancy,
            numBedrooms:
              typeof unit.numBedrooms === "string" ? parseInt(unit.numBedrooms) : unit.numBedrooms,
            numBathrooms:
              typeof unit.numBathrooms === "string"
                ? parseInt(unit.numBathrooms)
                : unit.numBathrooms,
          }
        }),
        buildingTotalUnits:
          typeof listing.buildingTotalUnits === "string"
            ? parseInt((listing.buildingTotalUnits as unknown) as string)
            : listing.buildingTotalUnits,
        unitsAvailable:
          typeof listing.unitsAvailable === "string"
            ? parseInt((listing.unitsAvailable as unknown) as string)
            : listing.unitsAvailable,
        yearBuilt:
          typeof listing.yearBuilt === "string"
            ? parseInt((listing.yearBuilt as unknown) as string)
            : listing.yearBuilt,
      },
    })
    const newListing = await new NewClient.ListingsService().create({
      body: {
        ...listing,
        applicationMethods: listing.applicationMethods.map((applicationMethod) => {
          return {
            ...applicationMethod,
            type: (applicationMethod.type as unknown) as NewClient.ApplicationMethodType,
          }
        }),
        preferences: listing.preferences.map((pref) => {
          return {
            ...pref,
            ordinal: typeof pref.ordinal === "string" ? parseInt(pref.ordinal) : pref.ordinal,
          }
        }),
        property: { id: property.id },
        events: [],
        // NOTE: There isn't one in current schema but there could be applicationPickupAddress
        //       in legacy data.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        applicationPickUpAddress: listing.applicationPickupAddress,
        applicationDueDate: new Date(listing.applicationDueDate),
        applicationOpenDate: new Date(listing.applicationOpenDate),
        postmarkedApplicationsReceivedByDate: new Date(
          listing.postmarkedApplicationsReceivedByDate
        ),
        waitlistMaxSize:
          typeof listing.waitlistMaxSize === "string"
            ? parseInt((listing.waitlistMaxSize as unknown) as string)
            : listing.waitlistMaxSize,
        waitlistCurrentSize:
          typeof listing.waitlistCurrentSize === "string"
            ? parseInt((listing.waitlistCurrentSize as unknown) as string)
            : listing.waitlistCurrentSize,
        applicationPickUpAddressOfficeHours: "",
        status: (listing.status as unknown) as NewClient.ListingStatus,
        displayWaitlistSize: false,
      },
    })

    // const relatedApplications = oldApplications.filter((app) => app.listing.id === listing.id)
    // await Promise.all(
    //   relatedApplications.map(async (application) => {
    //     const body = {
    //       appUrl: application.appUrl,
    //       ...application.application,
    //       listing: { id: newListing.id },
    //       status: ApplicationStatus.submitted,
    //       language: Language.en,
    //       submissionType: ApplicationSubmissionType.electronical,
    //       acceptedTerms: true,
    //     } as NewClient.ApplicationCreate
    //     try {
    //       if (
    //         body.preferences.none === undefined &&
    //         body.preferences.liveIn === undefined &&
    //         body.preferences.workIn === undefined
    //       ) {
    //         body.preferences = {
    //           liveIn: false,
    //           workIn: false,
    //           none: true,
    //         }
    //       }
    //       body.householdMembers.forEach((member) => {
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         // @ts-ignore
    //         member.orderId = member.id
    //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //         // @ts-ignore
    //         member.id = undefined
    //       })
    //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //       // @ts-ignore
    //       if (body.demographics.howDidYouHear === "") {
    //         body.demographics.howDidYouHear = []
    //       }
    //       await newApplicationsService.create({
    //         body,
    //       })
    //     } catch (e) {
    //       console.error(e.response.data.message)
    //       console.error(application.createdAt)
    //       console.error(body.applicant.firstName)
    //       console.error(body.applicant.lastName)
    //     }
    //   })
    // )
  }
}
async function main() {
  try {
    await migrator()
  } catch (e) {
    console.error(e.response.data.message)
    process.exit(1)
  }
}
void main()
