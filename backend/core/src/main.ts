import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule)
  app.enableCors()
  await app.listen(process.env.PORT || 3001)
}
bootstrap()

export default app
