import { NestFactory } from "@nestjs/core"
import { SeederModule } from "./seeder/seeder.module"
import { ListingsSeederService } from "./seeder/listings-seeder/listings-seeder.service"
import { UserService } from "./user/user.service"
import { CreateUserDto } from "./user/createUser.dto"
import { plainToClass } from "class-transformer"
import { ApplicationsService } from "./applications/applications.service"
import { Application } from "./entity/application.entity"
import { ListingsService } from "./listings/listings.service"

async function bootstrap() {
  const argv = require("yargs").argv
  const app = await NestFactory.createApplicationContext(SeederModule.forRoot({ test: argv.test }))
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

  const listingsService = app.get<ListingsService>(ListingsService)
  const listing = (await listingsService.list()).listings[0]

  await plainToClass(Application, {
    user: { id: user.id },
    listing: { id: listing.id },
    application: { foo: "bar" },
  }).save()

  await plainToClass(Application, {
    user: { id: user2.id },
    listing: { id: listing.id },
    application: { foo: "bar2" },
  }).save()

  await app.close()
}
bootstrap()
