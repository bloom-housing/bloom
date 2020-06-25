import { NestFactory } from "@nestjs/core"
import { SeederModule } from "./seeder/seeder.module"
import { ListingsSeederService } from "./seeder/listings-seeder/listings-seeder.service"
import { UserService } from "./user/user.service"
import { CreateUserDto } from "./user/createUser.dto"
import { plainToClass } from "class-transformer"

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule)
  const listingsSeederService = app.get<ListingsSeederService>(ListingsSeederService)
  await listingsSeederService.seed()

  const userService = app.get<UserService>(UserService)
  await userService.createUser(
    plainToClass(CreateUserDto, {
      email: "test@example.com",
      firstName: "First",
      middleName: "Mid",
      lastName: "Last",
      dob: new Date(),
      password: "abcdef",
    })
  )
  await app.close()
}
bootstrap()
