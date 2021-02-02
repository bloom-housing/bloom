import { SeederModule } from "./seeder/seeder.module"
import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { ListingSeed, listingSeed1, seedListing } from "./seeds/listings"
import { UserService } from "./user/user.service"
import { plainToClass } from "class-transformer"
import { UserCreateDto } from "./user/dto/user.dto"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./user/entities/user.entity"
import { makeNewApplication } from "./seeds/applications"

const argv = yargs.scriptName("seed").options({
  test: { type: "boolean", default: false },
}).argv

const newSeed = (): ListingSeed => {
  return JSON.parse(JSON.stringify(listingSeed1)) as ListingSeed
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule.forRoot({ test: argv.test }))
  const listing1 = await seedListing(app, newSeed())
  const listingSeed = newSeed()
  const listing2 = await seedListing(app, {
    ...listingSeed,
    leasingAgents: [
      {
        ...listingSeed.leasingAgents[0],
        email: "leasing-agent-2@example.com",
      },
    ],
  })

  const userRepo = app.get<Repository<User>>(getRepositoryToken(User))

  const userService = app.get<UserService>(UserService)
  const user1 = await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "test@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
    })
  )

  const user2 = await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "test2@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "ghijkl",
    })
  )

  const admin = await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "admin@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
    })
  )

  for (let i = 0; i < 10; i++) {
    await Promise.all([
      await makeNewApplication(app, listing1, user1),
      await makeNewApplication(app, listing1, user2),
      await makeNewApplication(app, listing2, user1),
      await makeNewApplication(app, listing2, user2),
    ])
  }

  admin.isAdmin = true
  await userRepo.save(admin)

  await app.close()
}
void bootstrap()
