import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { plainToClass } from "class-transformer"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { INestApplicationContext } from "@nestjs/common"
import { ListingDefaultSeed } from "./seeds/listings/listing-default-seed"
import { ListingColiseumSeed } from "./seeds/listings/listing-coliseum-seed"
import { ListingDefaultDraftSeed } from "./seeds/listings/listing-default-draft"
import { ListingDefaultOpenSoonSeed } from "./seeds/listings/listing-default-open-soon"
import { ListingDefaultOnePreferenceSeed } from "./seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "./seeds/listings/listing-default-no-preference-seed"
import { ListingDefaultBmrChartSeed } from "./seeds/listings/listing-default-bmr-chart-seed"
import { ListingTritonSeed, ListingTritonSeedDetroit } from "./seeds/listings/listing-triton-seed"
import { ListingDefaultReservedSeed } from "./seeds/listings/listing-default-reserved-seed"
import { ListingDefaultFCFSSeed } from "./seeds/listings/listing-default-fcfs-seed"
import { ListingDefaultMultipleAMI } from "./seeds/listings/listing-default-multiple-ami"
import { ListingDefaultLottery } from "./seeds/listings/listing-default-lottery-results"
import { ListingDefaultLotteryPending } from "./seeds/listings/listing-default-lottery-pending"
import { ListingDefaultMultipleAMIAndPercentages } from "./seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultMissingAMI } from "./seeds/listings/listing-default-missing-ami"
import { ListingDefaultSanJoseSeed } from "./seeds/listings/listing-default-sanjose-seed"
import { AmiChartDefaultSeed } from "./seeds/ami-charts/default-ami-chart"
import {
  defaultLeasingAgents,
  getDisabilityOrMentalIllnessProgram,
  getDisplaceePreference,
  getHopwaPreference,
  getHousingSituationProgram,
  getLiveWorkPreference,
  getPbvPreference,
  getServedInMilitaryProgram,
  getTayProgram,
  getFlatRentAndRentBasedOnIncomeProgram,
} from "./seeds/listings/shared"
import { UserCreateDto } from "../auth/dto/user-create.dto"
import { AmiDefaultSanJose } from "./seeds/ami-charts/default-ami-chart-san-jose"
import { createJurisdictions } from "./seeds/jurisdictions"
import { AmiDefaultMissingAMI } from "./seeds/ami-charts/missing-household-ami-levels"
import { SeederModule } from "./seeder.module"
import { AmiDefaultTriton } from "./seeds/ami-charts/triton-ami-chart"
import { AmiDefaultTritonDetroit } from "./seeds/ami-charts/triton-ami-chart-detroit"
import { AmiDefaultSanMateo } from "./seeds/ami-charts/default-ami-chart-san-mateo"
import { makeNewApplication } from "./seeds/applications"
import { UserRoles } from "../auth/entities/user-roles.entity"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { UserService } from "../auth/services/user.service"
import { User } from "../auth/entities/user.entity"
import { MultiselectQuestion } from "../multiselect-question/entities/multiselect-question.entity"
import { Listing } from "../listings/entities/listing.entity"
import { ApplicationMethodsService } from "../application-methods/application-methods.service"
import { ApplicationMethodType } from "../application-methods/types/application-method-type-enum"
import { UnitTypesService } from "../unit-types/unit-types.service"
import dayjs from "dayjs"
import { CountyCode } from "../shared/types/county-code"
import { ApplicationFlaggedSetsCronjobService } from "../application-flagged-sets/application-flagged-sets-cronjob.service"
import { MapLayerSeeder } from "./seeds/map-layers"

const argv = yargs.scriptName("seed").options({
  test: { type: "boolean", default: false },
}).argv

// Note: if changing this list of seeds, you must also change the
// number in listings.e2e-spec.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listingSeeds: any[] = [
  ListingDefaultSeed,
  ListingColiseumSeed,
  ListingDefaultDraftSeed,
  ListingDefaultOpenSoonSeed,
  ListingDefaultOnePreferenceSeed,
  ListingDefaultNoPreferenceSeed,
  ListingDefaultBmrChartSeed,
  ListingTritonSeed,
  ListingDefaultReservedSeed,
  ListingDefaultFCFSSeed,
  ListingDefaultMultipleAMI,
  ListingDefaultMultipleAMIAndPercentages,
  ListingDefaultMissingAMI,
  ListingDefaultLottery,
  ListingDefaultLotteryPending,
  ListingDefaultSanJoseSeed,
  ListingTritonSeedDetroit,
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const amiSeeds: any[] = [
  AmiChartDefaultSeed,
  AmiDefaultMissingAMI,
  AmiDefaultTriton,
  AmiDefaultTritonDetroit,
  AmiDefaultSanJose,
  AmiDefaultSanMateo,
]

export function getSeedListingsCount() {
  return listingSeeds.length
}

export async function createLeasingAgents(
  app: INestApplicationContext,
  rolesRepo: Repository<UserRoles>,
  jurisdictions: Jurisdiction[]
) {
  const usersService = await app.resolve<UserService>(UserService)
  const leasingAgents = await Promise.all(
    defaultLeasingAgents.map(
      async (leasingAgent) =>
        await usersService.createPublicUser(
          plainToClass(UserCreateDto, {
            ...leasingAgent,
            jurisdictions: [jurisdictions[0]],
          })
        )
    )
  )
  await Promise.all([
    leasingAgents.map(async (agent: User) => {
      const roles: UserRoles = { user: agent, isPartner: true, userId: agent.id }
      await rolesRepo.save(roles)
      await usersService.confirm({ token: agent.confirmationToken })
    }),
  ])
  return leasingAgents
}

export async function createMultiselectQuestions(
  app: INestApplicationContext,
  jurisdictions: Jurisdiction[]
) {
  const multiselectQuestionsRepository = app.get<Repository<MultiselectQuestion>>(
    getRepositoryToken(MultiselectQuestion)
  )
  const multiselectQuestionsToSave = []

  jurisdictions.forEach((jurisdiction) => {
    multiselectQuestionsToSave.push(
      getLiveWorkPreference(jurisdiction.name),
      getPbvPreference(jurisdiction.name),
      getHopwaPreference(jurisdiction.name),
      getDisplaceePreference(jurisdiction.name),
      getServedInMilitaryProgram(jurisdiction.name),
      getTayProgram(jurisdiction.name),
      getDisabilityOrMentalIllnessProgram(jurisdiction.name),
      getHousingSituationProgram(jurisdiction.name),
      getFlatRentAndRentBasedOnIncomeProgram(jurisdiction.name)
    )
  })

  const multiselectQuestions = await multiselectQuestionsRepository.save(multiselectQuestionsToSave)

  for (const jurisdiction of jurisdictions) {
    jurisdiction.multiselectQuestions = multiselectQuestions.filter((question) => {
      const jurisdictionName = question.text.split("-").pop()
      return jurisdictionName === ` ${jurisdiction.name}`
    })
  }
  const jurisdictionsRepository = app.get<Repository<Jurisdiction>>(
    getRepositoryToken(Jurisdiction)
  )
  await jurisdictionsRepository.save(jurisdictions)
  return multiselectQuestions
}

const seedAmiCharts = async (app: INestApplicationContext) => {
  const allSeeds = amiSeeds.map((amiSeed) => app.get<AmiChartDefaultSeed>(amiSeed))
  const amiCharts = []
  for (const chart of allSeeds) {
    const amiChart = await chart.seed()
    amiCharts.push(amiChart)
  }
  return amiCharts
}

const seedListings = async (
  app: INestApplicationContext,
  rolesRepo: Repository<UserRoles>,
  jurisdictions: Jurisdiction[]
) => {
  const seeds = []
  const leasingAgents = await createLeasingAgents(app, rolesRepo, jurisdictions)
  await createMultiselectQuestions(app, jurisdictions)
  const allSeeds = listingSeeds.map((listingSeed) => app.get<ListingDefaultSeed>(listingSeed))
  const listingRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))
  const applicationMethodsService = await app.resolve<ApplicationMethodsService>(
    ApplicationMethodsService
  )

  for (const [index, listingSeed] of allSeeds.entries()) {
    const everyOtherAgent = index % 2 ? leasingAgents[0] : leasingAgents[1]
    const listing: Listing & { jurisdictionName?: string } = await listingSeed.seed()
    // set jurisdiction based off of the name provided on the seed
    listing.jurisdiction = jurisdictions.find(
      (jurisdiction) => jurisdiction.name === listing.jurisdictionName
    )
    listing.leasingAgents = [everyOtherAgent]
    const applicationMethods = await applicationMethodsService.create({
      type: ApplicationMethodType.Internal,
      acceptsPostmarkedApplications: false,
      externalReference: "",
      label: "Label",
      paperApplications: [],
      listing,
    })
    listing.applicationMethods = [applicationMethods]
    await listingRepository.save(listing)

    seeds.push(listing)
  }

  return seeds
}

async function seed() {
  const app = await NestFactory.create(SeederModule.forRoot({ test: argv["test"] }))
  // Starts listening for shutdown hooks
  app.enableShutdownHooks()
  const userService = await app.resolve<UserService>(UserService)
  const afsProcessingService = await app.resolve<ApplicationFlaggedSetsCronjobService>(
    ApplicationFlaggedSetsCronjobService
  )
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User))
  const rolesRepo = app.get<Repository<UserRoles>>(getRepositoryToken(UserRoles))
  const jurisdictions = await createJurisdictions(app)
  await seedAmiCharts(app)
  const listings = await seedListings(app, rolesRepo, jurisdictions)

  const mapLayerSeeder = app.get<MapLayerSeeder>(MapLayerSeeder)
  await mapLayerSeeder.seed(jurisdictions)

  const user1 = await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "test@example.com",
      emailConfirmation: "test@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "abcdef",
      jurisdictions: [jurisdictions[0]],
    })
  )

  await userService.confirm({ token: user1.confirmationToken })

  const user2 = await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "test2@example.com",
      emailConfirmation: "test2@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "ghijkl",
      passwordConfirmation: "ghijkl",
      jurisdictions: [jurisdictions[0]],
    })
  )
  await userService.confirm({ token: user2.confirmationToken })

  // create not confirmed user
  await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "user+notconfirmed@example.com",
      emailConfirmation: "user+notconfirmed@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "abcdef",
      jurisdictions: [jurisdictions[0]],
    })
  )

  // create user with expired password
  const userExpiredPassword = await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "user+expired@example.com",
      emailConfirmation: "user+expired@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "abcdef",
      jurisdictions: [jurisdictions[0]],
    })
  )

  await userService.confirm({ token: userExpiredPassword.confirmationToken })

  userExpiredPassword.passwordValidForDays = 180
  userExpiredPassword.passwordUpdatedAt = new Date("2020-01-01")
  userExpiredPassword.confirmedAt = new Date()

  await userRepo.save(userExpiredPassword)

  const admin = await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "admin@example.com",
      emailConfirmation: "admin@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "abcdef",
      jurisdictions,
    })
  )
  const roles: UserRoles = { user: admin, isPartner: false, isAdmin: true, userId: undefined }
  await rolesRepo.save(roles)
  await userService.confirm({ token: admin.confirmationToken })

  const mfaUser = await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "mfaUser@bloom.com",
      emailConfirmation: "mfaUser@bloom.com",
      firstName: "I",
      middleName: "Use",
      lastName: "MFA",
      dob: new Date(),
      password: "abcdef12",
      passwordConfirmation: "abcdef12",
      jurisdictions,
    })
  )
  await userRepo.save(mfaUser)
  await userRepo.save({
    ...mfaUser,
    mfaEnabled: true,
    mfaCode: "123456",
    mfaCodeUpdatedAt: dayjs(new Date()).add(1, "day"),
  })
  const mfaRoles: UserRoles = { user: mfaUser, isPartner: false, isAdmin: true, userId: undefined }
  await rolesRepo.save(mfaRoles)
  await userService.confirm({ token: mfaUser.confirmationToken })

  const alamedaJurisdiction = jurisdictions.filter((j) => j.name == CountyCode.alameda)[0]
  const alamedaAdmin = await userService.createPublicUser(
    plainToClass(UserCreateDto, {
      email: "alameda-admin@example.com",
      emailConfirmation: "alameda-admin@example.com",
      firstName: "Alameda",
      middleName: "Admin",
      lastName: "MFA",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "abcdef",
      jurisdictions: [alamedaJurisdiction],
      agreedToTermsOfService: true,
    })
  )
  await userRepo.save({ ...alamedaAdmin, agreedToTermsOfService: true })
  await userService.confirm({ token: alamedaAdmin.confirmationToken })

  const alamedaAdminRoles: UserRoles = {
    user: alamedaAdmin,
    isPartner: false,
    isAdmin: false,
    isJurisdictionalAdmin: true,
    userId: undefined,
  }
  await rolesRepo.save(alamedaAdminRoles)

  const unitTypesService = await app.resolve<UnitTypesService>(UnitTypesService)

  const unitTypes = await unitTypesService.list()

  for (let i = 0; i < 10; i++) {
    for (const listing of listings) {
      await Promise.all([
        await makeNewApplication(app, listing, unitTypes, listing.jurisdictionName, user1, i),
        await makeNewApplication(app, listing, unitTypes, listing.jurisdictionName, user2, i + 10),
      ])
    }
  }
  await afsProcessingService.process()

  await app.close()
}

void seed()
