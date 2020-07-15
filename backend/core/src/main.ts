import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { logger } from "./middleware/logger.middleware"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { EntityNotFoundExceptionFilter } from "./filters/entity-not-found-exception.filter"

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule)
  app.enableCors()
  app.use(logger)
  app.useGlobalFilters(new EntityNotFoundExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      // Only allow props through that have been specified in the appropriate DTO
      whitelist: true,
      // Automatically transform validated prop values into their specified types
      transform: true,
    })
  )
  const options = new DocumentBuilder()
    .setTitle("Bloom API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)
  await app.listen(process.env.PORT || 3001)
}
bootstrap()

export default app
