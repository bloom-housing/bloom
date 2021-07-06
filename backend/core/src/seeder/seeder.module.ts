import { DynamicModule, Module } from "@nestjs/common"

import { TypeOrmModule } from "@nestjs/typeorm"
import dbOptions = require("../../ormconfig")
import testDbOptions = require("../../ormconfig.test")
import { ThrottlerModule } from "@nestjs/throttler"
import { SharedModule } from "../shared/shared.module"
import { AuthModule } from "../auth/auth.module"
import { ApplicationsModule } from "../applications/applications.module"
import { ListingsModule } from "../listings/listings.module"
import { AmiChartsModule } from "../ami-charts/ami-charts.module"

@Module({})
export class SeederModule {
  static forRoot(options: { test: boolean }): DynamicModule {
    const dbConfig = options.test ? testDbOptions : dbOptions
    return {
      module: SeederModule,
      imports: [
        SharedModule,
        TypeOrmModule.forRoot({
          ...dbConfig,
        }),
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 5,
          ignoreUserAgents: [/^node-superagent.*$/],
        }),
        ApplicationsModule,
        AuthModule,
        ListingsModule,
        AmiChartsModule,
      ],
    }
  }
}
