import { NestFactory } from "@nestjs/core"
import { SeederModule } from "./seeder/seeder.module"
import { ListingsSeederService } from "./seeder/listings-seeder/listings-seeder.service"
import { UserService } from "./user/user.service"
import { CreateUserDto } from "./user/createUser.dto"
import { plainToClass } from "class-transformer"
import { UserApplicationsService } from "./user-applications/user-applications.service"
import { Application } from "./entity/application.entity"
import { ListingsService } from "./listings/listings.service"

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule)
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

  const listingsService = app.get<ListingsService>(ListingsService)
  const listing = (await listingsService.list()).listings[0]

  const userApplicationsService = app.get<UserApplicationsService>(UserApplicationsService)

  await userApplicationsService.create(
    user.id,
    plainToClass(Application, {
      userId: user.id,
      listingId: listing.id,
      application: { foo: "bar" },
    })
  )

  await app.close()
}
bootstrap()
