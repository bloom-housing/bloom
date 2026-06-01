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
      `{"id":"d8842fca-6830-486f-80cc-85296a41847c","assets":[],"createdAt":"2026-06-01T06:15:26.738Z","updatedAt":"2026-06-01T06:50:23.921Z","additionalApplicationSubmissionNotes":null,"digitalApplication":true,"commonDigitalApplication":true,"paperApplication":false,"referralOpportunity":false,"accessibility":null,"amenities":null,"buildingTotalUnits":0,"developer":"Cielo Housing","listingFileNumber":null,"householdSizeMax":0,"householdSizeMin":0,"neighborhood":"North End","region":null,"configurableRegion":null,"petPolicy":null,"allowsDogs":null,"allowsCats":null,"smokingPolicy":null,"unitsAvailable":1,"unitAmenities":null,"servicesOffered":null,"yearBuilt":1900,"applicationDueDate":"2026-07-01T06:15:00.000Z","applicationOpenDate":"2026-05-31T06:15:25.104Z","applicationFee":"60","creditScreeningFee":null,"applicationOrganization":null,"applicationPickUpAddressOfficeHours":null,"applicationPickUpAddressType":null,"applicationDropOffAddressOfficeHours":null,"applicationDropOffAddressType":null,"applicationMailingAddressType":null,"buildingSelectionCriteria":null,"marketingFlyer":null,"accessibleMarketingFlyer":null,"cocInfo":null,"costsNotIncluded":null,"creditHistory":null,"criminalBackground":null,"depositMin":"0","depositMax":"50","depositType":null,"depositHelperText":"Deposit will not exceed one month's rent","disableUnitsAccordion":false,"hasHudEbllClearance":null,"leasingAgentEmail":"joe@smithrealty.com","leasingAgentName":"Joe Smith","leasingAgentOfficeHours":"9:00am - 5:00pm, Monday-Friday","leasingAgentPhone":"(773) 580-5897","leasingAgentTitle":"Senior Leasing Agent","managementWebsite":null,"name":"test notification listing","parkingFee":null,"parkType":null,"postmarkedApplicationsReceivedByDate":"2025-06-06T23:00:00.000Z","programRules":null,"rentalAssistance":"Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. ","rentalHistory":null,"requiredDocuments":null,"requiredDocumentsList":null,"specialNotes":null,"waitlistCurrentSize":null,"waitlistMaxSize":null,"whatToExpect":"<p>Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.</p>","whatToExpectAdditionalText":null,"status":"active","reviewOrderType":"firstComeFirstServe","displayWaitlistSize":false,"reservedCommunityDescription":"Seniors over 55 are eligible for this property ","reservedCommunityMinAge":null,"resultLink":null,"isWaitlistOpen":false,"waitlistOpenSpots":null,"customMapPin":false,"contentUpdatedAt":"2026-06-01T06:38:31.303Z","publishedAt":"2026-06-01T06:19:08.419Z","scheduledPublishAt":null,"closedAt":null,"afsLastRunAt":"1970-01-01T00:00:00.000Z","lotteryLastPublishedAt":null,"lotteryLastRunAt":null,"lotteryStatus":null,"lastApplicationUpdateAt":"2026-06-01T06:50:23.919Z","listingMultiselectQuestions":[],"applicationMethods":[{"createdAt":"2026-06-01T06:38:31.306Z","updatedAt":"2026-06-01T06:38:31.306Z","id":"6eda6877-1d17-4451-8281-b3efadd00165","type":"Internal","label":null,"externalReference":null,"acceptsPostmarkedApplications":null,"phoneNumber":null,"paperApplications":[]}],"listingEvents":[],"listingsBuildingAddress":{"id":"a3f24b64-8e54-4a2d-aa3a-5026d3dee83e","placeName":"Yellowstone National Park","city":"Yellowstone National Park","county":"Teton","state":"WY","street":"3200 Old Faithful Inn Rd","zipCode":"82190","latitude":44.45995,"longitude":-110.831197},"listingsApplicationPickUpAddress":{"placeName":"Yosemite National Park","city":"Yosemite Valley","county":"Mariposa","state":"CA","street":"9035 Village Dr","zipCode":"95389","latitude":37.7487501,"longitude":-119.5920354},"listingsApplicationDropOffAddress":{"placeName":"Yosemite National Park","city":"Yosemite Valley","county":"Mariposa","state":"CA","street":"9035 Village Dr","zipCode":"95389","latitude":37.7487501,"longitude":-119.5920354},"listingsApplicationMailingAddress":{"placeName":"Rocky Mountain National Park","city":"Estes Park","county":"Larimer","state":"CO","street":"1000 US-36","zipCode":"80517","latitude":40.3800984,"longitude":-105.5709864},"listingsLeasingAgentAddress":{"id":"fb4715f2-224a-454b-8717-914d37097568","placeName":"Rocky Mountain National Park","city":"Estes Park","county":"Larimer","state":"CO","street":"1000 US-36","zipCode":"80517","latitude":40.3800984,"longitude":-105.5709864},"listingsMarketingFlyerFile":null,"listingsAccessibleMarketingFlyerFile":null,"jurisdictions":{"id":"3f0dbbe8-a84d-4158-bfc8-fd8e378d68dc","name":"Bloomington"},"listingsResult":null,"reservedCommunityTypes":null,"listingImages":[{"ordinal":0,"assets":{"createdAt":"2026-06-01T06:15:26.741Z","updatedAt":"2026-06-01T06:15:26.741Z","id":"ee118a51-3e74-40e8-bf35-9ed613ff62b2","fileId":"https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/trayan-xIOYJSVEZ8c-unsplash_f1axsg.jpg","label":"cloudinaryBuilding"},"description":""}],"listingFeatures":{"accessibleHeightToilet":false,"accessibleParking":false,"acInUnit":false,"barrierFreeBathroom":false,"barrierFreeEntrance":false,"barrierFreePropertyEntrance":false,"barrierFreeUnitEntrance":true,"bathGrabBarsOrReinforcements":false,"bathroomCounterLowered":false,"brailleSignageInBuilding":false,"carbonMonoxideDetectorWithStrobe":false,"carpetInUnit":false,"elevator":true,"extraAudibleCarbonMonoxideDetector":false,"extraAudibleSmokeDetector":false,"fireSuppressionSprinklerSystem":false,"frontControlsDishwasher":false,"frontControlsStoveCookTop":false,"grabBars":true,"hardFlooringInUnit":false,"hearing":true,"hearingAndVision":false,"heatingInUnit":true,"inUnitWasherDryer":false,"kitchenCounterLowered":false,"laundryInBuilding":true,"leverHandlesOnDoors":false,"leverHandlesOnFaucets":false,"loweredCabinets":false,"loweredLightSwitch":false,"mobility":true,"noEntryStairs":false,"nonDigitalKitchenAppliances":false,"noStairsToParkingSpots":false,"noStairsWithinUnit":false,"parkingOnSite":true,"refrigeratorWithBottomDoorFreezer":false,"rollInShower":true,"serviceAnimalsAllowed":false,"smokeDetectorWithStrobe":false,"streetLevelEntrance":false,"toiletGrabBarsOrReinforcements":false,"ttyAmplifiedPhone":false,"turningCircleInBathrooms":false,"visual":false,"walkInShower":false,"wheelchairRamp":false,"wideDoorways":true},"listingUtilities":{"water":true,"gas":true,"trash":false,"sewer":true,"electricity":false,"cable":false,"phone":true,"internet":false},"units":[{"id":"4c129a57-c4d6-4d60-8cf6-83294f72d22b","amiChart":{"createdAt":"2026-06-01T06:15:26.383Z","updatedAt":"2026-06-01T06:15:26.383Z","id":"5e8aa82a-9ccb-4652-866b-0e5dabbc6001","name":"Noble Skyline - Bloomington"},"amiPercentage":"30","annualIncomeMin":null,"monthlyIncomeMin":"2000","floor":1,"annualIncomeMax":null,"maxOccupancy":3,"minOccupancy":1,"monthlyRent":"1200","numBathrooms":1,"numBedrooms":1,"number":"101","sqFeet":"750","monthlyRentAsPercentOfIncome":null,"bmrProgramChart":null,"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"d18d6ef2-4bea-462f-a10c-3a7c4135054d","name":"oneBdrm","numBedrooms":1},"unitRentTypes":null,"accessibilityPriorityType":null,"unitAmiChartOverrides":null}],"unitGroups":[],"unitsSummarized":{"unitTypes":[{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"d18d6ef2-4bea-462f-a10c-3a7c4135054d","name":"oneBdrm","numBedrooms":1}],"priorityTypes":[],"amiPercentages":["30"],"byUnitTypeAndRent":[{"areaRange":{"min":750,"max":750},"minIncomeRange":{"min":"$2,000","max":"$2,000"},"occupancyRange":{"min":1,"max":3},"rentRange":{"min":"$1,200","max":"$1,200"},"rentAsPercentIncomeRange":{"min":null,"max":null},"floorRange":{"min":1,"max":1},"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"d18d6ef2-4bea-462f-a10c-3a7c4135054d","name":"oneBdrm","numBedrooms":1},"totalAvailable":1}],"byUnitType":[{"areaRange":{"min":750,"max":750},"minIncomeRange":{"min":"$2,000","max":"$2,000"},"occupancyRange":{"min":1,"max":3},"rentRange":{"min":"$1,200","max":"$1,200"},"rentAsPercentIncomeRange":{"min":null,"max":null},"floorRange":{"min":1,"max":1},"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"d18d6ef2-4bea-462f-a10c-3a7c4135054d","name":"oneBdrm","numBedrooms":1},"totalAvailable":0}],"byAMI":[{"percent":"30","byUnitType":[{"areaRange":{"min":750,"max":750},"minIncomeRange":{"min":"$2,000","max":"$2,000"},"occupancyRange":{"min":1,"max":3},"rentRange":{"min":"$1,200","max":"$1,200"},"rentAsPercentIncomeRange":{"min":null,"max":null},"floorRange":{"min":1,"max":1},"unitTypes":{"createdAt":"2026-06-01T06:15:26.266Z","updatedAt":"2026-06-01T06:15:26.266Z","id":"d18d6ef2-4bea-462f-a10c-3a7c4135054d","name":"oneBdrm","numBedrooms":1},"totalAvailable":1}]}],"hmi":{"columns":{"sizeColumn":"listings.householdSize","maxIncomeMonth":"listings.maxIncomeMonth","maxIncomeYear":"listings.maxIncomeYear"},"rows":[{"sizeColumn":1,"maxIncomeMonth":"listings.monthlyIncome*income:$3,000.00","maxIncomeYear":"listings.annualIncome*income:$36,000"},{"sizeColumn":2,"maxIncomeMonth":"listings.monthlyIncome*income:$4,000.00","maxIncomeYear":"listings.annualIncome*income:$48,000"},{"sizeColumn":3,"maxIncomeMonth":"listings.monthlyIncome*income:$5,000.00","maxIncomeYear":"listings.annualIncome*income:$60,000"}]}},"urlSlug":"blue_sky_apartments_3200_old_faithful_inn_rd_yellowstone_national_park_wy","requestedChanges":null,"requestedChangesDate":"1970-01-01T07:00:00.000Z","lotteryOptIn":null,"includeCommunityDisclaimer":null,"communityDisclaimerTitle":null,"communityDisclaimerDescription":null,"marketingType":"marketing","marketingYear":null,"marketingSeason":null,"marketingMonth":null,"homeType":"apartment","isVerified":false,"section8Acceptance":false,"listingNeighborhoodAmenities":null,"lastUpdatedByUser":{"id":"2d272706-6d90-4457-839b-98fe00a0b464","name":"First Last"},"property":null,"showWaitlist":false,"configurableAccessibilityFeatures":["configurableAccessibilityFeatures.barrierFreeUnitEntrance","configurableAccessibilityFeatures.elevator","configurableAccessibilityFeatures.grabBars","configurableAccessibilityFeatures.hearing","configurableAccessibilityFeatures.heatingInUnit","configurableAccessibilityFeatures.laundryInBuilding","configurableAccessibilityFeatures.mobility","configurableAccessibilityFeatures.parkingOnSite","configurableAccessibilityFeatures.rollInShower","configurableAccessibilityFeatures.wideDoorways"],"mapPinPosition":"automatic","includeCommunityDisclaimerQuestion":null,"listingAvailabilityQuestion":"availableUnits","listingSection8Acceptance":"no","utilities":["water","gas","sewer","phone"],"reviewOrderQuestion":"reviewOrderFCFS","waitlistOpenQuestion":"no","digitalApplicationChoice":"yes","paperApplicationChoice":"no","referralOpportunityChoice":"no","canApplicationsBeMailedIn":"yes","canPaperApplicationsBePickedUp":"yes","canApplicationsBeDroppedOff":"yes","whereApplicationsMailedIn":"anotherAddress","whereApplicationsPickedUp":"anotherAddress","whereApplicationsDroppedOff":"anotherAddress","arePostmarksConsidered":"yes","postmarkByDateDateField":{"month":"06","day":"06","year":"2025"},"postmarkByDateTimeField":{"hours":"04","minutes":"00","period":"pm"},"applicationDueDateField":{"month":"06","day":"30","year":"2026"},"applicationDueTimeField":{"hours":"11","minutes":"15","period":"pm"},"commonDigitalApplicationChoice":"yes"}`,
      params
    )

    check(resp, { "update listing": (r) => r.status === 200 })
  })
}
