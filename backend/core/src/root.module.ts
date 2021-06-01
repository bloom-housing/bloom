import { ClassSerializerInterceptor, DynamicModule, INestApplication, Module } from "@nestjs/common"
import { logger } from "./middleware/logger.middleware"
import { EntityNotFoundExceptionFilter } from "./filters/entity-not-found-exception.filter"
import * as bodyParser from "body-parser"
import { Reflector } from "@nestjs/core"
import { RouterModule } from "nest-router"
import { routes } from "./routes"
import { AppModule } from "./v1/app.module"
import { AppModule as AppModuleV2 } from "./v2/app.module"

export class ModuleUtils {
  static setupMiddlewares(app: INestApplication) {
    app.enableCors()
    app.use(logger)
    app.useGlobalFilters(new EntityNotFoundExceptionFilter())
    app.use(bodyParser.json({ limit: "50mb" }))
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector), { excludeExtraneousValues: true })
    )
    return app
  }
}

@Module({})
export class RootModule extends ModuleUtils {

  static register(dbOptions): DynamicModule {
    return {
      module: RootModule,
      imports: [
        RouterModule.forRoutes(routes),
        AppModule.register(dbOptions),
        AppModuleV2.register(dbOptions)
      ]
    }
  }
}
