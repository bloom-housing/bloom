import { INestApplicationContext } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { IncomePeriod } from "../../applications/types/income-period-enum"
import { Language } from "../../shared/types/language-enum"
import { InputType } from "../../shared/types/input-type"
import { ApplicationStatus } from "../../applications/types/application-status-enum"
import { ApplicationSubmissionType } from "../../applications/types/application-submission-type-enum"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitType } from "../../unit-types/entities/unit-type.entity"
import { User } from "../../auth/entities/user.entity"
import { Application } from "../../applications/entities/application.entity"
import { ApplicationsService } from "../../applications/services/applications.service"
import { ApplicationCreateDto } from "../../applications/dto/application-create.dto"
import { ApplicationReviewStatus } from "../../applications/types/application-review-status-enum"

const getApplicationCreateDtoTemplate = (
  jurisdictionString: string
): Omit<ApplicationCreateDto, "user" | "listing" | "listingId" | "preferredUnit"> => {
  return {
    acceptedTerms: true,
    accessibility: {
      hearing: false,
      mobility: false,
      vision: false,
    },
    additionalPhone: false,
    additionalPhoneNumber: undefined,
    additionalPhoneNumberType: undefined,
    alternateAddress: {
      city: "city",
      county: "county",
      latitude: 52.0,
      longitude: 50,
      placeName: "Place Name",
      state: "state",
      street: "street",
      street2: "street2",
      zipCode: "zip code",
    },
    alternateContact: {
      agency: "agency",
      emailAddress: "test@example.com",
      firstName: "First",
      lastName: "Last",
      mailingAddress: {
        city: "city",
        county: "county",
        latitude: 52.0,
        longitude: 50,
        placeName: "Place Name",
        state: "state",
        street: "street",
        street2: "street2",
        zipCode: "zip code",
      },
      otherType: "other",
      phoneNumber: "(123) 123-1231",
      type: "friend",
    },
    appUrl: "",
    applicant: {
      address: {
        city: "city",
        county: "county",
        latitude: 52.0,
        longitude: 50,
        placeName: "Place Name",
        state: "state",
        street: "street",
        street2: "street2",
        zipCode: "zip code",
      },
      birthDay: "03",
      birthMonth: "04",
      birthYear: "1990",
      emailAddress: "test@example.com",
      firstName: "First",
      lastName: "Last",
      middleName: "Middle",
      noEmail: false,
      noPhone: false,
      phoneNumber: "(123) 123-1231",
      phoneNumberType: "cell",
      workAddress: {
        city: "city",
        county: "county",
        latitude: 52.0,
        longitude: 50,
        placeName: "Place Name",
        state: "state",
        street: "street",
        street2: "street2",
        zipCode: "zip code",
      },
      workInRegion: "no",
    },
    contactPreferences: [],
    demographics: {
      ethnicity: null,
      gender: null,
      howDidYouHear: ["email", "facebook"],
      race: ["asian", "filipino"],
      sexualOrientation: null,
      spokenLanguage: null,
    },
    householdMembers: [
      {
        address: {
          city: "city",
          county: "county",
          latitude: 52.0,
          longitude: 50,
          placeName: "Place Name",
          state: "state",
          street: "street",
          street2: "street2",
          zipCode: "zip code",
        },
        birthDay: "30",
        birthMonth: "01",
        birthYear: "1960",
        firstName: "First",
        lastName: "Last",
        middleName: "Middle",
        orderId: 1,
        relationship: "parent",
        sameAddress: "no",
        workAddress: {
          city: "city",
          county: "county",
          latitude: 52.0,
          longitude: 50,
          placeName: "Place Name",
          state: "state",
          street: "street",
          street2: "street2",
          zipCode: "zip code",
        },
        workInRegion: "no",
      },
    ],
    householdSize: 2,
    housingStatus: "status",
    income: "5000.00",
    incomePeriod: IncomePeriod.perMonth,
    incomeVouchers: [],
    householdExpectingChanges: false,
    householdStudent: false,
    language: Language.en,
    mailingAddress: {
      city: "city",
      county: "county",
      latitude: 52.0,
      longitude: 50,
      placeName: "Place Name",
      state: "state",
      street: "street",
      street2: "street2",
      zipCode: "zip code",
    },
    preferences: [
      {
        key: `Live/Work in County - ${jurisdictionString}`,
        claimed: true,
        options: [
          {
            key: "Live in County",
            checked: true,
            extraData: [],
          },
          {
            key: "Work in County",
            checked: false,
            extraData: [],
          },
        ],
      },
      {
        key: `Displacee Tenant Housing - ${jurisdictionString}`,
        claimed: true,
        options: [
          {
            key: "General",
            checked: true,
            extraData: [
              {
                key: "address",
                type: InputType.address,
                value: {
                  street: "Street",
                  street2: "Street2",
                  city: "City",
                  state: "state",
                  zipCode: "100200",
                  county: "Alameda",
                  latitude: null,
                  longitude: null,
                },
              },
            ],
          },
          {
            key: "Mission Corridor",
            checked: false,
            extraData: [],
          },
        ],
      },
    ],
    sendMailToMailingAddress: true,
    status: ApplicationStatus.submitted,
    submissionDate: new Date(),
    submissionType: ApplicationSubmissionType.electronical,
  }
}

export const makeNewApplication = async (
  app: INestApplicationContext,
  listing: Listing,
  unitTypes: UnitType[],
  jurisdictionString: string,
  user?: User,
  pos = 0
) => {
  let dto: ApplicationCreateDto = JSON.parse(
    JSON.stringify(getApplicationCreateDtoTemplate(jurisdictionString))
  )
  const applicationRepo = app.get<Repository<Application>>(getRepositoryToken(Application))

  dto.listing = listing
  dto.preferredUnit = unitTypes
  if (pos === 0 || pos === 10) {
    dto.reviewStatus = ApplicationReviewStatus.pending
  }
  // modifications set up
  const splitEmail = dto.applicant.emailAddress.split("@")
  const modifiedEmail = `${splitEmail[0]}${pos}@${splitEmail[1]}`
  const modifiedFirstName = `${dto.applicant.firstName}${pos}`
  const modifiedLastName = `${dto.applicant.lastName}${pos}`

  // modifications to applicant
  dto.applicant.firstName = modifiedFirstName
  dto.applicant.lastName = modifiedLastName
  dto.applicant.emailAddress = modifiedEmail

  // modifications to householdmembers
  if (dto.householdMembers?.length) {
    dto.householdMembers.forEach((mem) => {
      mem.firstName = `${modifiedFirstName}_${mem.firstName}${pos}`
      mem.lastName = `${modifiedLastName}_${mem.lastName}${pos}`
    })
  }

  await applicationRepo.save({
    ...dto,
    user,
    confirmationCode: ApplicationsService.generateConfirmationCode(),
  })

  if (pos === 0 || pos === 10) {
    // create a flagged duplicate by email
    dto = JSON.parse(JSON.stringify(getApplicationCreateDtoTemplate(jurisdictionString)))
    dto.listing = listing
    dto.preferredUnit = unitTypes
    dto.reviewStatus = ApplicationReviewStatus.pending
    // modifications to applicant
    dto.applicant.firstName = `${modifiedFirstName} B`
    dto.applicant.lastName = `${modifiedLastName} B`
    dto.applicant.emailAddress = modifiedEmail
    // modifications to householdmembers
    if (dto.householdMembers?.length) {
      dto.householdMembers.forEach((mem) => {
        mem.firstName = `${modifiedFirstName}_${mem.firstName}${pos} HHEmail`
        mem.lastName = `${modifiedLastName}_${mem.lastName}${pos} HHEmail`
      })
    }

    await applicationRepo.save({
      ...dto,
      user,
      confirmationCode: ApplicationsService.generateConfirmationCode(),
    })

    // create a flagged duplicate by name and DOB
    dto = JSON.parse(JSON.stringify(getApplicationCreateDtoTemplate(jurisdictionString)))
    dto.listing = listing
    dto.preferredUnit = unitTypes
    dto.reviewStatus = ApplicationReviewStatus.pending
    // modifications to applicant
    dto.applicant.firstName = modifiedFirstName
    dto.applicant.lastName = modifiedLastName
    dto.applicant.emailAddress = `${modifiedEmail}B`
    // modifications to householdmembers
    if (dto.householdMembers?.length) {
      dto.householdMembers.forEach((mem) => {
        mem.firstName = `${modifiedFirstName}_${mem.firstName}${pos} HHName`
        mem.lastName = `${modifiedLastName}_${mem.lastName}${pos} HHName`
      })
    }

    await applicationRepo.save({
      ...dto,
      user,
      confirmationCode: ApplicationsService.generateConfirmationCode(),
    })
  }
}
