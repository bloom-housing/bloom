import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { plainToClass } from "class-transformer"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { INestApplicationContext } from "@nestjs/common"
import { ListingDefaultSeed } from "./seeds/listings/listing-default-seed"
import { ListingColiseumSeed } from "./seeds/listings/listing-coliseum-seed"
import { ListingDefaultOpenSoonSeed } from "./seeds/listings/listing-default-open-soon"
import { ListingDefaultOnePreferenceSeed } from "./seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "./seeds/listings/listing-default-no-preference-seed"
import { ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed } from "./seeds/listings/listing-default-summary-without-and-listing-with-20-ami-percentage-seed"
import { ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-30-listing-with-10-ami-percentage-seed"
import { ListingDefaultSummaryWith30And60AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-30-and-60-ami-percentage-seed"
import { ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-10-listing-with-30-ami-percentage-seed"
import { ListingDefaultNeighborhoodAmenitiesSeed } from "./seeds/listings/listing-default-neighbor-amenities"
import { Listing10158Seed } from "./seeds/listings/listing-detroit-10158"
import { Listing10157Seed } from "./seeds/listings/listing-detroit-10157"
import { Listing10147Seed } from "./seeds/listings/listing-detroit-10147"
import { Listing10145Seed } from "./seeds/listings/listing-detroit-10145"
import { CountyCode } from "../shared/types/county-code"
import { ListingTreymoreSeed } from "./seeds/listings/listing-detroit-treymore"
import { AmiChart } from "../ami-charts/entities/ami-chart.entity"
import { WayneCountyMSHDA2021 } from "./seeds/ami-charts/WayneCountyMSHDA2021"
import { ListingDefaultBmrChartSeed } from "./seeds/listings/listing-default-bmr-chart-seed"
import { ListingTritonSeed, ListingTritonSeedDetroit } from "./seeds/listings/listing-triton-seed"
import { ListingDefaultReservedSeed } from "./seeds/listings/listing-default-reserved-seed"
import { ListingDefaultFCFSSeed } from "./seeds/listings/listing-default-fcfs-seed"
import { ListingDefaultMultipleAMI } from "./seeds/listings/listing-default-multiple-ami"
import { ListingDefaultLottery } from "./seeds/listings/listing-default-lottery-results"
import { ListingDefaultLotteryPending } from "./seeds/listings/listing-default-lottery-pending"
import { ListingDefaultMultipleAMIAndPercentages } from "./seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultMissingAMI } from "./seeds/listings/listing-default-missing-ami"
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
import { AuthContext } from "../auth/types/auth-context"
import { createJurisdictions } from "./seeds/jurisdictions"
import { AmiDefaultMissingAMI } from "./seeds/ami-charts/missing-household-ami-levels"
import { SeederModule } from "./seeder.module"
import { AmiDefaultTriton } from "./seeds/ami-charts/triton-ami-chart"
import { AmiDefaultTritonDetroit } from "./seeds/ami-charts/triton-ami-chart-detroit"
import { makeNewApplication } from "./seeds/applications"
import { UserRoles } from "../auth/entities/user-roles.entity"
import { Jurisdiction } from "../jurisdictions/entities/jurisdiction.entity"
import { UserService } from "../auth/services/user.service"
import { User } from "../auth/entities/user.entity"
import { Preference } from "../preferences/entities/preference.entity"
import { Program } from "../program/entities/program.entity"
import { Listing } from "../listings/entities/listing.entity"
import { UnitTypesService } from "../unit-types/unit-types.service"
import dayjs from "dayjs"

const argv = yargs.scriptName("seed").options({
  test: { type: "boolean", default: false },
}).argv

// Note: if changing this list of seeds, you must also change the
// number in listings.e2e-spec.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listingSeeds: any[] = [
  ListingDefaultSeed,
  ListingColiseumSeed,
  ListingDefaultOpenSoonSeed,
  ListingDefaultOnePreferenceSeed,
  ListingDefaultNoPreferenceSeed,
  ListingDefaultBmrChartSeed,
  ListingTritonSeed,
  ListingDefaultReservedSeed,
  ListingDefaultFCFSSeed,
  ListingDefaultSummaryWith30And60AmiPercentageSeed,
  ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed,
  ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed,
  ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed,
  ListingDefaultNeighborhoodAmenitiesSeed,
  Listing10145Seed,
  Listing10147Seed,
  Listing10157Seed,
  Listing10158Seed,
  ListingTreymoreSeed,
  ListingDefaultMultipleAMI,
  ListingDefaultMultipleAMIAndPercentages,
  ListingDefaultMissingAMI,
  ListingDefaultLottery,
  ListingDefaultLotteryPending,
  ListingTritonSeedDetroit,
  ListingDefaultFCFSSeed,
]

const amiSeeds: any[] = [
  AmiChartDefaultSeed,
  AmiDefaultMissingAMI,
  AmiDefaultTriton,
  AmiDefaultTritonDetroit,
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
          }),
          new AuthContext(null)
        )
    )
  )
  await Promise.all([
    leasingAgents.map(async (agent: User) => {
      const roles: UserRoles = { user: agent, isPartner: true }
      await rolesRepo.save(roles)
      await usersService.confirm({ token: agent.confirmationToken })
    }),
  ])
  return leasingAgents
}

export async function createPreferences(
  app: INestApplicationContext,
  jurisdictions: Jurisdiction[]
) {
  const preferencesRepository = app.get<Repository<Preference>>(getRepositoryToken(Preference))
  const preferencesToSave = []

  jurisdictions.forEach((jurisdiction) => {
    preferencesToSave.push(
      getLiveWorkPreference(jurisdiction.name),
      getPbvPreference(jurisdiction.name),
      getHopwaPreference(jurisdiction.name),
      getDisplaceePreference(jurisdiction.name)
    )
  })

  const preferences = await preferencesRepository.save(preferencesToSave)

  for (const jurisdiction of jurisdictions) {
    jurisdiction.preferences = preferences.filter((preference) => {
      const jurisdictionName = preference.title.split("-").pop()
      return jurisdictionName === ` ${jurisdiction.name}`
    })
  }
  const jurisdictionsRepository = app.get<Repository<Jurisdiction>>(
    getRepositoryToken(Jurisdiction)
  )
  await jurisdictionsRepository.save(jurisdictions)
  return preferences
}

export async function createPrograms(app: INestApplicationContext, jurisdictions: Jurisdiction[]) {
  const programsRepository = app.get<Repository<Program>>(getRepositoryToken(Program))
  const programs = await programsRepository.save([
    getServedInMilitaryProgram(),
    getTayProgram(),
    getDisabilityOrMentalIllnessProgram(),
    getHousingSituationProgram(),
    getFlatRentAndRentBasedOnIncomeProgram(),
  ])

  for (const jurisdiction of jurisdictions) {
    jurisdiction.programs = programs
  }
  const jurisdictionsRepository = app.get<Repository<Jurisdiction>>(
    getRepositoryToken(Jurisdiction)
  )
  await jurisdictionsRepository.save(jurisdictions)

  return programs
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
  await createPreferences(app, jurisdictions)
  const allSeeds = listingSeeds.map((listingSeed) => app.get<ListingDefaultSeed>(listingSeed))
  const listingRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))

  for (const [index, listingSeed] of allSeeds.entries()) {
    const everyOtherAgent = index % 2 ? leasingAgents[0] : leasingAgents[1]
    const listing: Listing & { jurisdictionName?: string } = await listingSeed.seed()
    // set jurisdiction based off of the name provided on the seed
    listing.jurisdiction = jurisdictions.find(
      (jurisdiction) => jurisdiction.name === listing.jurisdictionName
    )
    listing.leasingAgents = [everyOtherAgent]
    await listingRepository.save(listing)

    seeds.push(listing)
  }

  return seeds
}

async function seed() {
  const app = await NestFactory.create(SeederModule.forRoot({ test: argv.test }))
  // Starts listening for shutdown hooks
  app.enableShutdownHooks()
  const userService = await app.resolve<UserService>(UserService)

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User))
  const rolesRepo = app.get<Repository<UserRoles>>(getRepositoryToken(UserRoles))
  const jurisdictions = await createJurisdictions(app)
  await createPrograms(app, jurisdictions)
  await seedAmiCharts(app)
  const listings = await seedListings(app, rolesRepo, jurisdictions)

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
    }),
    new AuthContext(null)
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
    }),
    new AuthContext(null)
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
    }),
    new AuthContext(null)
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
      roles: { isAdmin: false, isPartner: true },
    }),
    new AuthContext(null)
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
    }),
    new AuthContext(null)
  )

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
    }),
    new AuthContext(null)
  )

  const unitTypesService = await app.resolve<UnitTypesService>(UnitTypesService)

  const unitTypes = await unitTypesService.list()

  for (let i = 0; i < 10; i++) {
    for (const listing of listings) {
      if (listing.countyCode !== CountyCode.detroit) {
        await Promise.all([
          await makeNewApplication(app, listing, unitTypes, user1),
          await makeNewApplication(app, listing, unitTypes, user2),
        ])
      }
    }
  }

  // Seed the Detroit AMI data, since it's not linked to any units.
  const amiChartRepo = app.get<Repository<AmiChart>>(getRepositoryToken(AmiChart))
  await amiChartRepo.save({
    ...JSON.parse(JSON.stringify(WayneCountyMSHDA2021)),
    jurisdiction: jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit"),
  })

  await userRepo.save(admin)
  await userRepo.save({
    ...mfaUser,
    mfaEnabled: false,
    mfaCode: "123456",
    mfaCodeUpdatedAt: dayjs(new Date()).add(1, "day"),
  })
  const roles: UserRoles = { user: admin, isPartner: true, isAdmin: true }
  const mfaRoles: UserRoles = { user: mfaUser, isPartner: true, isAdmin: true }
  await rolesRepo.save(roles)
  await rolesRepo.save(mfaRoles)

  await userService.confirm({ token: admin.confirmationToken })
  await userService.confirm({ token: mfaUser.confirmationToken })
  await app.close()
}

void seed()
