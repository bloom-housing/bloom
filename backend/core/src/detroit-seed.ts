import { SeederModule } from "./seeder/seeder.module"
import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { UserService } from "./auth/services/user.service"
import { plainToClass } from "class-transformer"
import { UserCreateDto } from "./auth/dto/user-create.dto"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./auth/entities/user.entity"
import { INestApplicationContext } from "@nestjs/common"
import { ListingDefaultSeed } from "./seeds/listings/listing-default-seed"
import { Listing } from "./listings/entities/listing.entity"
import { defaultLeasingAgents } from "./seeds/listings/shared"
import { AuthContext } from "./auth/types/auth-context"
import { Listing10158Seed } from "./seeds/listings/listing-detroit-10158"
import { Listing10157Seed } from "./seeds/listings/listing-detroit-10157"
import { Listing10147Seed } from "./seeds/listings/listing-detroit-10147"
import { Listing10145Seed } from "./seeds/listings/listing-detroit-10145"
import { ListingTreymoreSeed } from "./seeds/listings/listing-detroit-treymore"
import { UserRoles } from "./auth/entities/user-roles.entity"
import { AmiChart } from "./ami-charts/entities/ami-chart.entity"
import { WayneCountyMSHDA2021 } from "./seeds/ami-charts"
import { Listing10151Seed } from "./seeds/listings/listing-detroit-10151"
import { Listing10153Seed } from "./seeds/listings/listing-detroit-10153"
import { Listing10154Seed } from "./seeds/listings/listing-detroit-10154"
import { Listing10155Seed } from "./seeds/listings/listing-detroit-10155"
import { Listing10159Seed } from "./seeds/listings/listing-detroit-10159"
import { Listing10168Seed } from "./seeds/listings/listing-detroit-10168"
import { createJurisdictions } from "./seeds/jurisdictions"
import { Jurisdiction } from "./jurisdictions/entities/jurisdiction.entity"
import { Listing10202Seed } from "./seeds/listings/listing-detroit-10202"
import { Listing10136Seed } from "./seeds/listings/listing-detroit-10136"

const argv = yargs.scriptName("seed").options({
  test: { type: "boolean", default: false },
}).argv

// Note: if changing this list of seeds, you must also change the
// number in listings.e2e-spec.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listingSeeds: any[] = [
  Listing10136Seed,
  Listing10145Seed,
  Listing10147Seed,
  Listing10151Seed,
  Listing10153Seed,
  Listing10154Seed,
  Listing10155Seed,
  Listing10157Seed,
  Listing10158Seed,
  Listing10159Seed,
  Listing10168Seed,
  Listing10202Seed,
  ListingTreymoreSeed,
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
            jurisdictions: [jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit")],
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

  for (const [index, listingSeed] of allSeeds.entries()) {
    const everyOtherAgent = index % 2 ? leasingAgents[0] : leasingAgents[1]
    const listing = await listingSeed.seed()
    listing.jurisdiction = jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit")
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
  const listings = await seedListings(app, rolesRepo, jurisdictions)

  let user1 = await userService.findByEmail("test@example.com")
  if (user1 === undefined) {
    user1 = await userService.createPublicUser(
      plainToClass(UserCreateDto, {
        email: "test@example.com",
        emailConfirmation: "test@example.com",
        firstName: "First",
        middleName: "Mid",
        lastName: "Last",
        dob: new Date(),
        password: "abcdef",
        passwordConfirmation: "Abcdef1!",
        jurisdictions: [jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit")],
      }),
      new AuthContext(null)
    )
    await userService.confirm({ token: user1.confirmationToken })
  }

  let user2 = await userService.findByEmail("test2@example.com")
  if (user2 === undefined) {
    user2 = await userService.createPublicUser(
      plainToClass(UserCreateDto, {
        email: "test2@example.com",
        emailConfirmation: "test2@example.com",
        firstName: "Second",
        middleName: "Mid",
        lastName: "Last",
        dob: new Date(),
        password: "ghijkl",
        passwordConfirmation: "Ghijkl1!",
        jurisdictions: [jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit")],
      }),
      new AuthContext(null)
    )
    await userService.confirm({ token: user2.confirmationToken })
  }

  let admin = await userService.findByEmail("admin@example.com")
  if (admin === undefined) {
    admin = await userService.createPublicUser(
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

    await userRepo.save(admin)
    const roles: UserRoles = { user: admin, isPartner: true, isAdmin: true }
    await rolesRepo.save(roles)
    await userService.confirm({ token: admin.confirmationToken })
  }

  // Seed the Detroit AMI data, since it's not linked to any units.
  const amiChartRepo = app.get<Repository<AmiChart>>(getRepositoryToken(AmiChart))
  await amiChartRepo.save({
    ...JSON.parse(JSON.stringify(WayneCountyMSHDA2021)),
    jurisdiction: jurisdictions.find((jurisdiction) => jurisdiction.name == "Detroit"),
  })
  await app.close()
}

void seed()
