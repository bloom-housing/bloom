import { Logger } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { getConnection } from "typeorm"
import { ConfigService } from "@nestjs/config"
import dbOptions = require("../ormconfig")
import { NestFactoryStatic } from "@nestjs/core/nest-factory"
import { ModuleUtils, RootModule } from "./root.module"

let app
async function bootstrap() {
  const apiFactory = new NestFactoryStatic()
  app = await apiFactory.create(RootModule.register(dbOptions))
  app = ModuleUtils.setupMiddlewares(app)
  const conn = getConnection()
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
  const config = new DocumentBuilder()
    .setTitle("Bloom API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false })
  SwaggerModule.setup("docs", app, document)
  const configService: ConfigService = app.get(ConfigService)
  await app.listen(configService.get<number>("PORT"))
}
void bootstrap()

export default app
