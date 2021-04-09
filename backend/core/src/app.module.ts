import { DynamicModule, INestApplication, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from "./user/user.module"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import { AuthModule } from "./auth/auth.module"

import { ListingsModule } from "./listings/listings.module"
import { ApplicationsModule } from "./applications/applications.module"
import { EntityNotFoundExceptionFilter } from "./filters/entity-not-found-exception.filter"
import { logger } from "./middleware/logger.middleware"
import { PreferencesModule } from "./preferences/preferences.module"
import { UnitsModule } from "./units/units.module"
import { ConfigModule } from "@nestjs/config"
import Joi from "joi"
import { PropertyGroupsModule } from "./property-groups/property-groups.module"
import { PropertiesModule } from "./property/properties.module"
import { AmiChartsModule } from "./ami-charts/ami-charts.module"
import * as bodyParser from "body-parser"
import { ThrottlerModule } from "@nestjs/throttler"
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis"
import Redis from "ioredis"

export function applicationSetup(app: INestApplication) {
  app.enableCors()
  app.use(logger)
  app.useGlobalFilters(new EntityNotFoundExceptionFilter())
  app.use(bodyParser.json({ limit: "50mb" }))
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
  return app
}

@Module({})
export class AppModule {
  static register(dbOptions): DynamicModule {
    /**
     * DEV NOTE:
     * This configuration is required due to issues with
     * self signed certificates in Redis 6.
     *
     * { rejectUnauthorized: false } option is intentional and required
     *
     * Read more:
     * https://help.heroku.com/HC0F8CUS/redis-connection-issues
     * https://devcenter.heroku.com/articles/heroku-redis#ioredis-module
     */
    const redis = new Redis(process.env.REDIS_TLS_URL, {
      tls: {
        rejectUnauthorized: false,
      },
    })

    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            PORT: Joi.number().default(3100).required(),
            NODE_ENV: Joi.string()
              .valid("development", "staging", "production", "test")
              .default("development"),
            DATABASE_URL: Joi.string().required(),
            REDIS_TLS_URL: Joi.string().required(),
          }),
        }),
        TypeOrmModule.forRoot({
          ...dbOptions,
          autoLoadEntities: true,
        }),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
<<<<<<< HEAD
          storage: new ThrottlerStorageRedisService(redis),
=======
          storage: new ThrottlerStorageRedisService(process.env.REDIS_TLS_URL),
>>>>>>> 833a80bb9b54908c88a8a958f074cb23126d46e2
        }),
        UserModule,
        AuthModule,
        ListingsModule,
        ApplicationsModule,
        PreferencesModule,
        UnitsModule,
        PropertiesModule,
        PropertyGroupsModule,
        AmiChartsModule,
      ],
    }
  }
}
