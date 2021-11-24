import { SeederModule } from "./seeder/seeder.module"
import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { UserService } from "./auth/services/user.service"
import { plainToClass } from "class-transformer"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./auth/entities/user.entity"
import { makeNewApplication } from "./seeds/applications"
import { INestApplicationContext } from "@nestjs/common"
import { ListingDefaultSeed } from "./seeds/listings/listing-default-seed"
import {
  defaultLeasingAgents,
  getDisabilityOrMentalIlnessProgram,
  getHousingSituationProgram,
  getServedInMilitaryProgram,
  getTayProgram,
  getDisplaceePreference,
  getHopwaPreference,
  getLiveWorkPreference,
  getPbvPreference,
} from "./seeds/listings/shared"
import { ListingDefaultSanJoseSeed } from "./seeds/listings/listing-default-sanjose-seed"
import { Listing } from "./listings/entities/listing.entity"
import { ListingColiseumSeed } from "./seeds/listings/listing-coliseum-seed"
import { ListingDefaultOpenSoonSeed } from "./seeds/listings/listing-default-open-soon"
import { ListingDefaultOnePreferenceSeed } from "./seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "./seeds/listings/listing-default-no-preference-seed"
import { ListingTritonSeed } from "./seeds/listings/listing-triton-seed"
import { ListingDefaultBmrChartSeed } from "./seeds/listings/listing-default-bmr-chart-seed"
import { ApplicationMethodsService } from "./application-methods/application-methods.service"
import { ApplicationMethodType } from "./application-methods/types/application-method-type-enum"
import { AuthContext } from "./auth/types/auth-context"
import { ListingDefaultReservedSeed } from "./seeds/listings/listing-default-reserved-seed"
import { ListingDefaultFCFSSeed } from "./seeds/listings/listing-default-fcfs-seed"
import { UserRoles } from "./auth/entities/user-roles.entity"
import { ListingDefaultMultipleAMI } from "./seeds/listings/listing-default-multiple-ami"
import { ListingDefaultMultipleAMIAndPercentages } from "./seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultMissingAMI } from "./seeds/listings/listing-default-missing-ami"
import { AmiChartDefaultSeed } from "./seeds/ami-charts/default-ami-chart"
import { createJurisdictions } from "./seeds/jurisdictions"
import { Jurisdiction } from "./jurisdictions/entities/jurisdiction.entity"
import { UserCreateDto } from "./auth/dto/user-create.dto"
import { UnitTypesService } from "./unit-types/unit-types.service"
import { Preference } from "./preferences/entities/preference.entity"
import { Program } from "./program/entities/program.entity"
import { AmiDefaultMissingAMI } from "./seeds/ami-charts/missing-household-ami-levels"
import { AmiDefaultTriton } from "./seeds/ami-charts/triton-ami-chart"
import { AmiDefaultTritonDetroit } from "./seeds/ami-charts/triton-ami-chart-detroit"
import { AmiDefaultSanJose } from "./seeds/ami-charts/default-ami-chart-san-jose"
import { AmiDefaultSanMateo } from "./seeds/ami-charts/default-ami-chart-san-mateo"

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
  ListingDefaultMultipleAMI,
  ListingDefaultMultipleAMIAndPercentages,
  ListingDefaultMissingAMI,
  ListingDefaultSanJoseSeed,
]

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
    getDisabilityOrMentalIlnessProgram(),
    getHousingSituationProgram(),
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

  const unitTypesService = await app.resolve<UnitTypesService>(UnitTypesService)

  const unitTypes = await unitTypesService.list()

  for (let i = 0; i < 10; i++) {
    for (const listing of listings) {
      await Promise.all([
        await makeNewApplication(app, listing, unitTypes, user1),
        await makeNewApplication(app, listing, unitTypes, user2),
      ])
    }
  }

  await userRepo.save(admin)
  const roles: UserRoles = { user: admin, isPartner: true, isAdmin: true }
  await rolesRepo.save(roles)

  await userService.confirm({ token: admin.confirmationToken })
  await app.close()
}

void seed()
