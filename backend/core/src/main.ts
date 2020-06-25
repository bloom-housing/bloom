import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { logger } from "./middleware/logger.middleware"
import { ValidationPipe } from "@nestjs/common"

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use(logger)
  app.useGlobalPipes(
    new ValidationPipe({
      // Only allow props through that have been specified in the appropriate DTO
      whitelist: true,
      // Automatically transform validated prop values into their specified types
      transform: true,
    })
  )
  await app.listen(process.env.PORT || 3001)
}
bootstrap()

export default app
