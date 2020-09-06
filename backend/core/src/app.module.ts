import { INestApplication, Module, ValidationPipe } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from "./user/user.module"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../ormconfig")
import { AuthModule } from "./auth/auth.module"

import { ListingsModule } from "./listings/listings.module"
import { ApplicationsModule } from "./applications/applications.module"
import { EntityNotFoundExceptionFilter } from "./filters/entity-not-found-exception.filter"
import { logger } from "./middleware/logger.middleware"
import { AssetsModule } from "./assets/assets.module"
import { PreferencesModule } from "./preferences/preferences.module"
import { ApplicationMethodsModule } from "./application-methods/application-methods.module"
import { UnitsModule } from "./units/units.module"

export function applicationSetup(app: INestApplication) {
  app.enableCors()
  app.use(logger)
  app.useGlobalFilters(new EntityNotFoundExceptionFilter())
  app.useGlobalPipes(
    new ValidationPipe({
      // Only allow props through that have been specified in the appropriate DTO
      whitelist: true,
      // Automatically transform validated prop values into their specified types
      transform: true,
      forbidNonWhitelisted: true,
    })
  )
  return app
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    ListingsModule,
    ApplicationsModule,
    AssetsModule,
    PreferencesModule,
    ApplicationMethodsModule,
    UnitsModule,
  ],
})
export class AppModule {}
