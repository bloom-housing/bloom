import { SeederModule } from "./seeder/seeder.module"
import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { UserService } from "./auth/services/user.service"
import { plainToClass } from "class-transformer"
import { UserCreateDto } from "./auth/dto/user.dto"
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
import { ListingDefaultBmrChartSeed } from "./seeds/listings/listing-default-bmr-chart-seed"
import { ApplicationMethodsService } from "./application-methods/application-methods.service"
import { ApplicationMethodType } from "./application-methods/types/application-method-type-enum"
import { PaperApplicationsService } from "./paper-applications/paper-applications.service"
import { Language } from "./shared/types/language-enum"
import { AssetsService } from "./assets/services/assets.service"
import { AuthContext } from "./auth/types/auth-context"
import { ListingDefaultReservedSeed } from "./seeds/listings/listing-default-reserved-seed"
import { ListingDefaultFCFSSeed } from "./seeds/listings/listing-default-fcfs-seed"
import { Listing10158Seed } from "./seeds/listings/listing-detroit-10158"
import { Listing10157Seed } from "./seeds/listings/listing-detroit-10157"
import { Listing10147Seed } from "./seeds/listings/listing-detroit-10147"
import { Listing10145Seed } from "./seeds/listings/listing-detroit-10145"
import { CountyCode } from "./shared/types/county-code"
import { ListingTreymoreSeed } from "./seeds/listings/listing-detroit-treymore"

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
  Listing10145Seed,
  Listing10147Seed,
  Listing10157Seed,
  Listing10158Seed,
  ListingTreymoreSeed,
]

export function getSeedListingsCount() {
  return listingSeeds.length
}

export async function createLeasingAgents(app: INestApplicationContext) {
  const usersService = await app.resolve<UserService>(UserService)
  const leasingAgents = await Promise.all(
    defaultLeasingAgents.map(
      async (leasingAgent) => await usersService.createUser(leasingAgent, new AuthContext(null))
    )
  )
  await Promise.all([
    leasingAgents.map(async (agent: User) => {
      await usersService.confirm({ token: agent.confirmationToken })
    }),
  ])
  return leasingAgents
}

async function createApplicationMethods(app: INestApplicationContext) {
  const assetsService = await app.resolve<AssetsService>(AssetsService)
  const englishFileAsset = await assetsService.create({
    fileId: "englishFileId",
    label: "English paper application",
  })
  const paperApplicationsService = await app.resolve<PaperApplicationsService>(
    PaperApplicationsService
  )
  const englishPaperApplication = await paperApplicationsService.create({
    language: Language.en,
    file: englishFileAsset,
  })
  const applicationMethodsService = await app.resolve<ApplicationMethodsService>(
    ApplicationMethodsService
  )

  await applicationMethodsService.create({
    type: ApplicationMethodType.FileDownload,
    acceptsPostmarkedApplications: false,
    externalReference: "https://bit.ly/2wH6dLF",
    label: "English",
    paperApplications: [englishPaperApplication],
  })

  await applicationMethodsService.create({
    type: ApplicationMethodType.Internal,
    acceptsPostmarkedApplications: false,
    externalReference: "",
    label: "Label",
    paperApplications: [],
  })
}

const seedListings = async (app: INestApplicationContext) => {
  const seeds = []
  const leasingAgents = await createLeasingAgents(app)
  await createApplicationMethods(app)

  const allSeeds = listingSeeds.map((listingSeed) => app.get<ListingDefaultSeed>(listingSeed))
  const listingRepository = app.get<Repository<Listing>>(getRepositoryToken(Listing))

  for (const [index, listingSeed] of allSeeds.entries()) {
    const listing = await listingSeed.seed()
    // Don't add leasing agent assignments for Detroit
    if (listing.countyCode !== CountyCode.detroit) {
      const everyOtherAgent = index % 2 ? leasingAgents[0] : leasingAgents[1]
      listing.leasingAgents = [everyOtherAgent]
      await listingRepository.save(listing)
    }
    seeds.push(listing)
  }

  return seeds
}

async function seed() {
  const app = await NestFactory.create(SeederModule.forRoot({ test: argv.test }))
  const userService = await app.resolve<UserService>(UserService)

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User))
  const listings = await seedListings(app)

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
    }),
    new AuthContext(null)
  )

  for (let i = 0; i < 10; i++) {
    for (const listing of listings) {
      await Promise.all([
        await makeNewApplication(app, listing, user1),
        await makeNewApplication(app, listing, user2),
      ])
    }
  }

  admin.isAdmin = true
  await userRepo.save(admin)
  await userService.confirm({ token: admin.confirmationToken })

  await app.close()
}

void seed()
