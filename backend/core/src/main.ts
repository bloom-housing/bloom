import { NestFactory } from "@nestjs/core"
import { applicationSetup, AppModule } from "./app.module"
import { Logger } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { DataSource } from "typeorm"
import { ConfigService } from "@nestjs/config"
import dbOptions from "../ormconfig"

let app
async function bootstrap() {
  app = await NestFactory.create(AppModule.register(dbOptions), {
    logger: process.env.NODE_ENV === "development" ? ["error", "warn", "log"] : ["error", "warn"],
  })
  // Starts listening for shutdown hooks
  app.enableShutdownHooks()
  app = applicationSetup(app)
  const conn = new DataSource({ ...dbOptions })
  await conn.initialize()
  // showMigrations returns true if there are pending migrations
  if (await conn.showMigrations()) {
    if (process.env.NODE_ENV === "development") {
      Logger.warn(
        "Detected pending migrations. Please run 'yarn db:migration:run' or remove /dist directory " +
          "(compiled files are retained and you could e.g. have migration .js files from other" +
          "branches that TypeORM is incorrectly trying to find in migrations table in the DB)."
      )
    } else {
      Logger.error(
        "Detected pending migrations. Please run 'yarn db:migration:run' before starting the app."
      )
      process.exit(1)
    }
  }
  const options = new DocumentBuilder()
    .setTitle("Bloom API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup("docs", app, document)
  const configService: ConfigService = app.get(ConfigService)
  await app.listen(configService.get<number>("PORT"))
}
void bootstrap()

export default app
