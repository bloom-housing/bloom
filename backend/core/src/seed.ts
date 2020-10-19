import { NestFactory } from "@nestjs/core"
import { SeederModule } from "./seeder/seeder.module"
import { ListingsSeederService } from "./seeder/listings-seeder/listings-seeder.service"
import { UserService } from "./user/user.service"
import { CreateUserDto } from "./user/createUser.dto"
import { plainToClass } from "class-transformer"
import { Application } from "./entity/application.entity"
import { ListingsService } from "./listings/listings.service"
import { User } from "./entity/user.entity"
import { Repository } from "typeorm"
import { getRepositoryToken } from "@nestjs/typeorm"

async function bootstrap() {
  const argv = require("yargs").argv
  const app = await NestFactory.createApplicationContext(SeederModule.forRoot({ test: argv.test }))
  const userRepo = app.get<Repository<User>>(getRepositoryToken(User))
  const listingsSeederService = app.get<ListingsSeederService>(ListingsSeederService)
  await listingsSeederService.seed()

  const userService = app.get<UserService>(UserService)
  const user = await userService.createUser(
    plainToClass(CreateUserDto, {
      email: "test@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
    })
  )

  const user2 = await userService.createUser(
    plainToClass(CreateUserDto, {
      email: "test2@example.com",
      firstName: "Second",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "ghijkl",
    })
  )

  const admin = await userService.createUser(
    plainToClass(CreateUserDto, {
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

  const listingsService = app.get<ListingsService>(ListingsService)
  const listing = (await listingsService.list()).listings[0]

  await plainToClass(Application, {
    user: { id: user.id },
    listing: { id: listing.id },
    application: { foo: "bar" },
    appUrl: "aaaa",
  }).save()

  await plainToClass(Application, {
    user: { id: user2.id },
    listing: { id: listing.id },
    application: { foo: "bar2" },
    appUrl: "bbbb",
  }).save()

  await app.close()
}
bootstrap()
