import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from "./user/user.module"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../ormconfig")
import { AuthModule } from "./auth/auth.module"
import { UserApplicationsModule } from "./user-applications/user-applications.module"
import { ListingsModule } from "./listings/listings.module"
import { ApplicationsModule } from "./applications/applications.module"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    UserModule,
    UserApplicationsModule,
    AuthModule,
    ListingsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
