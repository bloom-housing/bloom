import { SeederModule } from "./seeder/seeder.module"
import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { ListingSeed, seedListing, defaultListingSeed, allSeeds } from "./seeds/listings"
import { UserService } from "./user/user.service"
import { plainToClass } from "class-transformer"
import { UserCreateDto } from "./user/dto/user.dto"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./user/entities/user.entity"
import { makeNewApplication } from "./seeds/applications"
import { INestApplicationContext } from "@nestjs/common"

const argv = yargs.scriptName("seed").options({
  test: { type: "boolean", default: false },
}).argv

const parseSeed = (seedData: ListingSeed): ListingSeed => {
  return JSON.parse(JSON.stringify(seedData)) as ListingSeed
}

export async function getDefaultLeasingAgents(app: INestApplicationContext, seed: ListingSeed) {
  const usersService = app.get<UserService>(UserService)
  const leasingAgents = await Promise.all(
    seed.leasingAgents.map(async (leasingAgent) => await usersService.createUser(leasingAgent))
  )
  await Promise.all([
    leasingAgents.map(async (agent: User) => {
      await usersService.confirm({ token: agent.confirmationToken })
    }),
  ])
  return leasingAgents
}

const getListing = async (
  app: INestApplicationContext,
  leasingAgents: User[],
  seed: ListingSeed
) => {
  const thisSeed = parseSeed(seed)
  const thisListing = await seedListing(app, thisSeed, leasingAgents)
  return thisListing
}

const seedListings = async (app: INestApplicationContext) => {
  const seeds = []
  const leasingAgents = await getDefaultLeasingAgents(app, parseSeed(defaultListingSeed))

  allSeeds.forEach((seed, index) => {
    const everyOtherAgent = index % 2 ? leasingAgents[0] : leasingAgents[1]
    seeds.push(getListing(app, [everyOtherAgent], seed))
  })

  return seeds
}

async function seed() {
  const app = await NestFactory.createApplicationContext(SeederModule.forRoot({ test: argv.test }))
  const userService = app.get<UserService>(UserService)

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
    })
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
    })
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
    })
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
