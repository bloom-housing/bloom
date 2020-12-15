import { SeederModule } from "./seeder/seeder.module"
import { NestFactory } from "@nestjs/core"
import yargs from "yargs"
import { listingSeed1, seedListing } from "./seeds/listings"
import { UserService } from "./user/user.service"
import { plainToClass } from "class-transformer"
import { UserCreateDto } from "./user/dto/user.dto"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"
import { User } from "./user/entities/user.entity"

const argv = yargs.scriptName("seed").options({
  test: { type: "boolean", default: false },
}).argv

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule.forRoot({ test: argv.test }))
  await seedListing(app, listingSeed1)
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User))

  const userService = app.get<UserService>(UserService)
  await userService.createUser(
    plainToClass(UserCreateDto, {
      email: "test@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
    })
  )

  await userService.createUser(
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
  admin.isAdmin = true
  await userRepo.save(admin)

  await app.close()
}
void bootstrap()
