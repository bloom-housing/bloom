import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { logger } from "./middleware/logger.middleware"

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use(logger)
  await app.listen(process.env.PORT || 3001)
}
bootstrap()

export default app
