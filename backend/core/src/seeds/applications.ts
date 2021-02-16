import { INestApplicationContext } from "@nestjs/common"
import { Listing, User } from "../.."
import { ApplicationCreateDto } from "../applications/dto/application.dto"
import { Repository } from "typeorm"
import {
  Application,
  ApplicationStatus,
  ApplicationSubmissionType,
  IncomePeriod,
  Language,
} from "../applications/entities/application.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { InputType } from "../shared/input-type"

const applicationCreateDtoTemplate: Omit<ApplicationCreateDto, "user" | "listing"> = {
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
    ethnicity: "ethnicity",
    gender: "gender",
    howDidYouHear: ["email", "facebook"],
    race: "race",
    sexualOrientation: "orientation",
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
      emailAddress: "household@example.com",
      firstName: "First",
      lastName: "Last",
      middleName: "Middle",
      noEmail: false,
      noPhone: false,
      orderId: 1,
      phoneNumber: "(123) 123-1231",
      phoneNumberType: "cell",
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
  incomeVouchers: false,
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
      key: "liveWork",
      claimed: true,
      options: [
        {
          key: "live",
          checked: true,
        },
        {
          key: "work",
          checked: false,
        },
      ],
    },
    {
      key: "displacedTenant",
      claimed: true,
      options: [
        {
          key: "general",
          checked: true,
          extraData: [
            {
              key: "name",
              type: InputType.text,
              value: "Roger Thornhill",
            },
            {
              key: "address",
              type: InputType.address,
              value: {
                street: "",
                street2: "",
                city: "",
                state: "",
                zipCode: "",
                county: "",
                latitude: null,
                longitude: null,
              },
            },
          ],
        },
        {
          key: "missionCorridor",
          checked: false,
        },
      ],
    },
  ],
  preferredUnit: ["studio"],
  sendMailToMailingAddress: true,
  status: ApplicationStatus.submitted,
  submissionDate: new Date(),
  submissionType: ApplicationSubmissionType.electronical,
}

export const makeNewApplication = async (
  app: INestApplicationContext,
  listing: Listing,
  user?: User
) => {
  const dto: ApplicationCreateDto = JSON.parse(JSON.stringify(applicationCreateDtoTemplate))
  dto.user = user
  dto.listing = listing
  const applicationRepo = app.get<Repository<Application>>(getRepositoryToken(Application))
  return await applicationRepo.save(dto)
}
