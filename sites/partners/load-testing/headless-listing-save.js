/* eslint-disable import/no-unresolved */
import { group, check } from "k6"
import http from "k6/http"

export const options = {
  vus: 1,
  iterations: 1,
}

export default function () {
  let params
  let resp
  let url
  let userCookies

  group("Default group", function () {
    params = {
      headers: {
        language: `en`,
        appurl: `https://partners.core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "content-type": `application/json`,
        referer: `https://partners.core-dev.bloomhousing.dev/sign-in`,
      },
      cookies: {},
    }

    url = http.url`https://partners.core-dev.bloomhousing.dev/api/adapter/auth/login`
    resp = http.request("POST", url, `{"email":"admin@example.com","password":"abcdef"}`, params)

    check(resp, { "sign in": (r) => r.status === 201 })
    userCookies = resp.cookies
    // eslint-disable-next-line no-undef
    console.log("33:", userCookies)

    params = {
      headers: {
        language: `en`,
        appurl: `https://partners.core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        referer: `https://partners.core-dev.bloomhousing.dev/sign-in`,
      },
      cookies: {},
    }

    url = http.url`https://partners.core-dev.bloomhousing.dev/api/adapter/user`
    resp = http.request("GET", url, null, params)

    check(resp, { "get user": (r) => r.status === 200 })

    params = {
      headers: {
        language: `en`,
        appurl: `https://partners.core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        "content-type": `application/json`,
        referer: `https://partners.core-dev.bloomhousing.dev/listings/5fdfd253-d270-48e4-92ee-793ec5beda78/edit`,
      },
      cookies: {},
    }

    url = http.url`https://partners.core-dev.bloomhousing.dev/api/adapter/listings/5fdfd253-d270-48e4-92ee-793ec5beda78`
    resp = http.request(
      "PUT",
      url,
      `{"id":"5fdfd253-d270-48e4-92ee-793ec5beda78","assets":[],"createdAt":"2026-06-01T06:15:26.738Z","updatedAt":"2026-06-01T06:50:23.921Z","additionalApplicationSubmissionNotes":null,"digitalApplication":true,"commonDigitalApplication":true,"paperApplication":false,"referralOpportunity":false,"accessibility":null,"amenities":null,"buildingTotalUnits":0,"developer":"Cielo Housing","listingFileNumber":null,"householdSizeMax":0,"householdSizeMin":0,"neighborhood":"North End","region":"Eastside","configurableRegion":null,"petPolicy":null,"allowsDogs":null,"allowsCats":null,"smokingPolicy":null,"unitsAvailable":1,"unitAmenities":null,"servicesOffered":null,"yearBuilt":1900,"applicationDueDate":"2026-07-01T06:15:00.000Z","applicationOpenDate":"2026-05-31T06:15:25.104Z","applicationFee":"60","creditScreeningFee":null,"applicationOrganization":null,"applicationPickUpAddressOfficeHours":null,"applicationPickUpAddressType":null,"applicationDropOffAddressOfficeHours":null,"applicationDropOffAddressType":null,"applicationMailingAddressType":null,"buildingSelectionCriteria":null,"marketingFlyer":null,"accessibleMarketingFlyer":null,"cocInfo":null,"costsNotIncluded":null,"creditHistory":null,"criminalBackground":null,"depositMin":"0","depositMax":"50","depositType":null,"depositHelperText":"Deposit will not exceed one month's rent","disableUnitsAccordion":false,"hasHudEbllClearance":null,"leasingAgentEmail":"joe@smithrealty.com","leasingAgentName":"Joe Smith","leasingAgentOfficeHours":"9:00am - 5:00pm, Monday-Friday","leasingAgentPhone":"(773) 580-5897","leasingAgentTitle":"Senior Leasing Agent","managementWebsite":null,"name":"Blue Sky Apartments","parkingFee":null,"parkType":null,"postmarkedApplicationsReceivedByDate":"2025-06-06T23:00:00.000Z","programRules":null,"rentalAssistance":"Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. ","rentalHistory":null,"requiredDocuments":null,"requiredDocumentsList":null,"specialNotes":null,"waitlistCurrentSize":null,"waitlistMaxSize":null,"whatToExpect":"<p>Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.</p>","whatToExpectAdditionalText":null,"status":"active","reviewOrderType":"firstComeFirstServe","displayWaitlistSize":false,"reservedCommunityDescription":"Seniors over 55 are eligible for this property ","reservedCommunityMinAge":null,"resultLink":null,"isWaitlistOpen":false,"waitlistOpenSpots":null,"customMapPin":false,"contentUpdatedAt":"2026-06-01T06:38:31.303Z","publishedAt":"2026-06-01T06:19:08.419Z","scheduledPublishAt":null,"closedAt":null,"afsLastRunAt":"1970-01-01T00:00:00.000Z","lotteryLastPublishedAt":null,"lotteryLastRunAt":null,"lotteryStatus":null,"lastApplicationUpdateAt":"2026-06-01T06:50:23.919Z","listingMultiselectQuestions":[{"multiselectQuestions":{"createdAt":"2026-06-01T06:15:26.415Z","updatedAt":"2026-06-01T06:15:26.415Z","id":"fe910943-d01f-4900-bd3e-b62782d61740","applicationSection":"preferences","description":"Employees of the local city.","isExclusive":false,"hideFromListing":false,"links":[],"multiselectOptions":[],"name":"City Employees","options":[{"collectAddress":false,"ordinal":0,"text":"At least one member of my household is a city employee"}],"optOutText":null,"status":"draft","subText":"sub text for City Employees","text":"City Employees"},"ordinal":1,"id":"fe910943-d01f-4900-bd3e-b62782d61740","listingId":"5fdfd253-d270-48e4-92ee-793ec5beda78"},{"multiselectQuestions":{"createdAt":"2026-06-01T06:15:26.429Z","updatedAt":"2026-06-01T06:15:26.429Z","id":"6cef9823-d856-404e-83e1-d77c0f0caf3b","applicationSection":"programs","description":"Have you or anyone in your household served in the US military?","isExclusive":false,"hideFromListing":false,"links":[],"multiselectOptions":[],"name":"Veterans","options":[{"exclusive":true,"ordinal":0,"text":"Yes"},{"exclusive":true,"ordinal":1,"text":"No"}],"optOutText":null,"status":"draft","subText":"sub text for Veterans","text":"Veterans"},"ordinal":1,"id":"6cef9823-d856-404e-83e1-d77c0f0caf3b","listingId":"5fdfd253-d270-48e4-92ee-793ec5beda78"}],"applicationMethods":[{"createdAt":"2026-06-01T06:38:31.306Z","updatedAt":"2026-06-01T06:38:31.306Z","id":"2af7095c-8da4-4d51-ab65-2dc41dd3a759","type":"Internal","label":null,"externalReference":null,"acceptsPostmarkedApplications":null,"phoneNumber":null,"paperApplications":[]}],"listingEvents":[],"listingsBuildingAddress":{"id":"c245a4ca-389f-42bb-91bb-e674fe745626","placeName":"Yellowstone National Park","city":"Yellowstone National Park","county":"Teton","state":"WY","street":"3200 Old Faithful Inn Rd","zipCode":"82190","latitude":44.45995,"longitude":-110.831197},"listingsApplicationPickUpAddress":{"placeName":"Yosemite National Park","city":"Yosemite Valley","county":"Mariposa","state":"CA","street":"9035 Village Dr","zipCode":"95389","latitude":37.7487501,"longitude":-119.5920354},"listingsApplicationDropOffAddress":{"placeName":"Yosemite National Park","city":"Yosemite Valley","county":"Mariposa","state":"CA","street":"9035 Village Dr","zipCode":"95389","latitude":37.7487501,"longitude":-119.5920354},"listingsApplicationMailingAddress":{"placeName":"Rocky Mountain National Park","city":"Estes Park","county":"Larimer","state":"CO","street":"1000 US-36","zipCode":"80517","latitude":40.3800984,"longitude":-105.5709864},"listingsLeasingAgentAddress":{"id":"df45caa6-6bfd-4c4f-8b86-fe36b7e7148b","placeName":"Rocky Mountain National Park","city":"Estes Park","county":"Larimer","state":"CO","street":"1000 US-36","zipCode":"80517","latitude":40.3800984,"longitude":-105.5709864},"listingsMarketingFlyerFile":null,"listingsAccessibleMarketingFlyerFile":null,"jurisdictions":{"id":"2bc7a6c3-13b2-4a7e-9a98-2f47d9686ba5","name":"Bloomington"},"listingsResult":null,"reservedCommunityTypes":null,"listingImages":[{"ordinal":0,"assets":{"createdAt":"2026-06-01T06:15:26.741Z","updatedAt":"2026-06-01T06:15:26.741Z","id":"8fdc510b-6c0d-43b1-8374-e229d004c00a","fileId":"https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/trayan-xIOYJSVEZ8c-unsplash_f1axsg.jpg","label":"cloudinaryBuilding"},"description":""}],"listingFeatures":{"accessibleHeightToilet":false,"accessibleParking":false,"acInUnit":false,"barrierFreeBathroom":false,"barrierFreeEntrance":false,"barrierFreePropertyEntrance":false,"barrierFreeUnitEntrance":true,"bathGrabBarsOrReinforcements":false,"bathroomCounterLowered":false,"brailleSignageInBuilding":false,"carbonMonoxideDetectorWithStrobe":false,"carpetInUnit":false,"elevator":true,"extraAudibleCarbonMonoxideDetector":false,"extraAudibleSmokeDetector":false,"fireSuppressionSprinklerSystem":false,"frontControlsDishwasher":false,"frontControlsStoveCookTop":false,"grabBars":true,"hardFlooringInUnit":false,"hearing":true,"hearingAndVision":false,"heatingInUnit":true,"inUnitWasherDryer":false,"kitchenCounterLowered":false,"laundryInBuilding":true,"leverHandlesOnDoors":false,"leverHandlesOnFaucets":false,"loweredCabinets":false,"loweredLightSwitch":false,"mobility":true,"noEntryStairs":false,"nonDigitalKitchenAppliances":false,"noStairsToParkingSpots":false,"noStairsWithinUnit":false,"parkingOnSite":true,"refrigeratorWithBottomDoorFreezer":false,"rollInShower":true,"serviceAnimalsAllowed":false,"smokeDetectorWithStrobe":false,"streetLevelEntrance":false,"toiletGrabBarsOrReinforcements":false,"ttyAmplifiedPhone":false,"turningCircleInBathrooms":false,"visual":false,"walkInShower":false,"wheelchairRamp":false,"wideDoorways":true},"listingUtilities":{"water":true,"gas":true,"trash":false,"sewer":true,"electricity":false,"cable":false,"phone":true,"internet":false},"units":[{"id":"e9a908de-acd4-4d7b-931d-db66f8746589","amiChart":{"createdAt":"2026-06-01T06:15:26.383Z","updatedAt":"2026-06-01T06:15:26.383Z","id":"645159a2-5611-4bd4-9038-5cdde882ab6d","name":"Noble Skyline - Bloomington"},"amiPercentage":"30","annualIncomeMin":null,"monthlyIncomeMin":"2000","floor":1,"annualIncomeMax":null,"maxOccupancy":3,"minOccupancy":1,"monthlyRent":"1200","numBathrooms":1,"numBedrooms":1,"number":"101","sqFeet":"750","monthlyRentAsPercentOfIncome":null,"bmrProgramChart":null,"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"ee78d841-c49a-487d-b316-834037673338","name":"oneBdrm","numBedrooms":1},"unitRentTypes":null,"accessibilityPriorityType":null,"unitAmiChartOverrides":null}],"unitGroups":[],"unitsSummarized":{"unitTypes":[{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"ee78d841-c49a-487d-b316-834037673338","name":"oneBdrm","numBedrooms":1}],"priorityTypes":[],"amiPercentages":["30"],"byUnitTypeAndRent":[{"areaRange":{"min":750,"max":750},"minIncomeRange":{"min":"$2,000","max":"$2,000"},"occupancyRange":{"min":1,"max":3},"rentRange":{"min":"$1,200","max":"$1,200"},"rentAsPercentIncomeRange":{"min":null,"max":null},"floorRange":{"min":1,"max":1},"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"ee78d841-c49a-487d-b316-834037673338","name":"oneBdrm","numBedrooms":1},"totalAvailable":1}],"byUnitType":[{"areaRange":{"min":750,"max":750},"minIncomeRange":{"min":"$2,000","max":"$2,000"},"occupancyRange":{"min":1,"max":3},"rentRange":{"min":"$1,200","max":"$1,200"},"rentAsPercentIncomeRange":{"min":null,"max":null},"floorRange":{"min":1,"max":1},"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"ee78d841-c49a-487d-b316-834037673338","name":"oneBdrm","numBedrooms":1},"totalAvailable":0}],"byAMI":[{"percent":"30","byUnitType":[{"areaRange":{"min":750,"max":750},"minIncomeRange":{"min":"$2,000","max":"$2,000"},"occupancyRange":{"min":1,"max":3},"rentRange":{"min":"$1,200","max":"$1,200"},"rentAsPercentIncomeRange":{"min":null,"max":null},"floorRange":{"min":1,"max":1},"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"ee78d841-c49a-487d-b316-834037673338","name":"oneBdrm","numBedrooms":1},"totalAvailable":1}]}],"hmi":{"columns":{"sizeColumn":"listings.householdSize","maxIncomeMonth":"listings.maxIncomeMonth","maxIncomeYear":"listings.maxIncomeYear"},"rows":[{"sizeColumn":1,"maxIncomeMonth":"listings.monthlyIncome*income:$3,000.00","maxIncomeYear":"listings.annualIncome*income:$36,000"},{"sizeColumn":2,"maxIncomeMonth":"listings.monthlyIncome*income:$4,000.00","maxIncomeYear":"listings.annualIncome*income:$48,000"},{"sizeColumn":3,"maxIncomeMonth":"listings.monthlyIncome*income:$5,000.00","maxIncomeYear":"listings.annualIncome*income:$60,000"}]}},"urlSlug":"blue_sky_apartments_3200_old_faithful_inn_rd_yellowstone_national_park_wy","requestedChanges":null,"requestedChangesDate":"1970-01-01T07:00:00.000Z","lotteryOptIn":null,"includeCommunityDisclaimer":null,"communityDisclaimerTitle":null,"communityDisclaimerDescription":null,"marketingType":"marketing","marketingYear":null,"marketingSeason":null,"marketingMonth":null,"homeType":"apartment","isVerified":false,"section8Acceptance":false,"listingNeighborhoodAmenities":{"id":"19ab44a0-e2b0-4fbf-8c81-0a24730e1bb5"},"lastUpdatedByUser":{"id":"e8b52193-bb71-4668-ba2b-0b0fcfb7adbc","name":"First Last"},"property":null,"showWaitlist":false,"configurableAccessibilityFeatures":["configurableAccessibilityFeatures.barrierFreeUnitEntrance","configurableAccessibilityFeatures.elevator","configurableAccessibilityFeatures.grabBars","configurableAccessibilityFeatures.hearing","configurableAccessibilityFeatures.heatingInUnit","configurableAccessibilityFeatures.laundryInBuilding","configurableAccessibilityFeatures.mobility","configurableAccessibilityFeatures.parkingOnSite","configurableAccessibilityFeatures.rollInShower","configurableAccessibilityFeatures.wideDoorways"],"mapPinPosition":"automatic","includeCommunityDisclaimerQuestion":null,"listingAvailabilityQuestion":"availableUnits","listingSection8Acceptance":"no","utilities":["water","gas","sewer","phone"],"reviewOrderQuestion":"reviewOrderFCFS","waitlistOpenQuestion":"no","digitalApplicationChoice":"yes","paperApplicationChoice":"no","referralOpportunityChoice":"no","canApplicationsBeMailedIn":"yes","canPaperApplicationsBePickedUp":"yes","canApplicationsBeDroppedOff":"yes","whereApplicationsMailedIn":"anotherAddress","whereApplicationsPickedUp":"anotherAddress","whereApplicationsDroppedOff":"anotherAddress","arePostmarksConsidered":"yes","postmarkByDateDateField":{"month":"06","day":"06","year":"2025"},"postmarkByDateTimeField":{"hours":"04","minutes":"00","period":"pm"},"applicationDueDateField":{"month":"06","day":"30","year":"2026"},"applicationDueTimeField":{"hours":"11","minutes":"15","period":"pm"},"commonDigitalApplicationChoice":"yes"}`,
      params
    )

    check(resp, { "update listing": (r) => r.status === 200 })

    params = {
      headers: {
        language: `en`,
        appurl: `https://partners.core-dev.bloomhousing.dev`,
        accept: `application/json, text/plain, */*`,
        referer: `https://partners.core-dev.bloomhousing.dev/listings/5fdfd253-d270-48e4-92ee-793ec5beda78`,
        "if-none-match": `"k920zspi18ayu"`,
      },
      cookies: {},
    }

    url = http.url`https://partners.core-dev.bloomhousing.dev/api/adapter/jurisdictions/2bc7a6c3-13b2-4a7e-9a98-2f47d9686ba5`
    resp = http.request("GET", url, null, params)

    check(resp, { "get updated listing": (r) => r.status === 304 })
  })
}
