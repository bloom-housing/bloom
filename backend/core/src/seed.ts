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
import { defaultLeasingAgents } from "./seeds/listings/shared"
import { Listing } from "./listings/entities/listing.entity"
import { ListingColiseumSeed } from "./seeds/listings/listing-coliseum-seed"
import { ListingDefaultOpenSoonSeed } from "./seeds/listings/listing-default-open-soon"
import { ListingDefaultOnePreferenceSeed } from "./seeds/listings/listing-default-one-preference-seed"
import { ListingDefaultNoPreferenceSeed } from "./seeds/listings/listing-default-no-preference-seed"
import { ListingTritonSeed } from "./seeds/listings/listing-triton-seed"
import { ListingDefaultSummaryWith30And60AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-30-and-60-ami-percentage-seed"
import { ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed } from "./seeds/listings/listing-default-summary-without-and-listing-with-20-ami-percentage-seed"
import { ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-30-listing-with-10-ami-percentage-seed"
import { ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed } from "./seeds/listings/listing-default-summary-with-10-listing-with-30-ami-percentage-seed"
import { ApplicationMethodsService } from "./application-methods/application-methods.service"
import { ApplicationMethodType } from "./application-methods/types/application-method-type-enum"
import { AuthContext } from "./auth/types/auth-context"
import { ListingDefaultReservedSeed } from "./seeds/listings/listing-default-reserved-seed"
import { Listing10158Seed } from "./seeds/listings/listing-detroit-10158"
import { Listing10157Seed } from "./seeds/listings/listing-detroit-10157"
import { Listing10147Seed } from "./seeds/listings/listing-detroit-10147"
import { Listing10145Seed } from "./seeds/listings/listing-detroit-10145"
import { CountyCode } from "./shared/types/county-code"
import { ListingTreymoreSeed } from "./seeds/listings/listing-detroit-treymore"
import { UserRoles } from "./auth/entities/user-roles.entity"
import { AmiChart } from "./ami-charts/entities/ami-chart.entity"
import { WayneCountyMSHDA2021 } from "./seeds/ami-charts"
import { ListingDefaultMultipleAMI } from "./seeds/listings/listing-default-multiple-ami"
import { ListingDefaultMultipleAMIAndPercentages } from "./seeds/listings/listing-default-multiple-ami-and-percentages"
import { ListingDefaultMissingAMI } from "./seeds/listings/listing-default-missing-ami"
import { createJurisdictions } from "./seeds/jurisdictions"
import { Jurisdiction } from "./jurisdictions/entities/jurisdiction.entity"
import { UserCreateDto } from "./auth/dto/user-create.dto"
import { UnitTypesService } from "./unit-types/unit-types.service"

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
  ListingTritonSeed,
  ListingDefaultReservedSeed,
  ListingDefaultSummaryWith30And60AmiPercentageSeed,
  ListingDefaultSummaryWithoutAndListingWith20AmiPercentageSeed,
  ListingDefaultSummaryWith30ListingWith10AmiPercentageSeed,
  ListingDefaultSummaryWith10ListingWith30AmiPercentageSeed,
  Listing10145Seed,
  Listing10147Seed,
  Listing10157Seed,
  Listing10158Seed,
  ListingTreymoreSeed,
  ListingDefaultMultipleAMI,
  ListingDefaultMultipleAMIAndPercentages,
  ListingDefaultMissingAMI,
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
        await usersService.createUser(
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

const seedListings = async (
  app: INestApplicationContext,
  rolesRepo: Repository<UserRoles>,
  jurisdictions: Jurisdiction[]
) => {
  const seeds = []
  const leasingAgents = await createLeasingAgents(app, rolesRepo, jurisdictions)

  const allSeeds = listingSeeds.map((listingSeed) => app.get<ListingDefaultSeed>(listingSeed))
  const listingRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))
  const applicationMethodsService = await app.resolve<ApplicationMethodsService>(
    ApplicationMethodsService
  )

  for (const [index, listingSeed] of allSeeds.entries()) {
    const everyOtherAgent = index % 2 ? leasingAgents[0] : leasingAgents[1]
    const listing = await listingSeed.seed()
    listing.jurisdiction = jurisdictions[0]
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
  const listings = await seedListings(app, rolesRepo, jurisdictions)

  const user1 = await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "test@example.com",
      emailConfirmation: "test@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "Abcdef1!",
      jurisdictions: [jurisdictions[0]],
    }),
    new AuthContext(null)
  )
  await userService.confirm({ token: user1.confirmationToken })

  const user2 = await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "test2@example.com",
      emailConfirmation: "test2@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "ghijkl",
      passwordConfirmation: "Ghijkl1!",
      jurisdictions: [jurisdictions[0]],
    }),
    new AuthContext(null)
  )
  await userService.confirm({ token: user2.confirmationToken })

  const admin = await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "admin@example.com",
      emailConfirmation: "admin@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
      passwordConfirmation: "Abcdef1!",
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
  await amiChartRepo.save(JSON.parse(JSON.stringify(WayneCountyMSHDA2021)))

  await userRepo.save(admin)
  const roles: UserRoles = { user: admin, isPartner: true, isAdmin: true }
  await rolesRepo.save(roles)

  await userService.confirm({ token: admin.confirmationToken })
  await app.close()
}

void seed()
