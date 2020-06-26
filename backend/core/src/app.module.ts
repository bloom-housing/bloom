import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Listing } from "./entity/listing.entity"
import { Attachment } from "./entity/attachment.entity"
import { Unit } from "./entity/unit.entity"
import { Preference } from "./entity/preference.entity"
import { UserModule } from "./user/user.module"
// Use require because of the CommonJS/AMD style export.
// See https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import dbOptions = require("../ormconfig")
import { AuthModule } from "./auth/auth.module"
import { Application } from "./entity/application.entity"
import { UserApplicationsModule } from "./user-applications/user-applications.module"
import { ListingsModule } from "./listings/listings.module"
import { ApplicationsModule } from "./applications/applications.module"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Listing, Attachment, Preference, Unit, Application]),
    UserModule,
    UserApplicationsModule,
    AuthModule,
    ListingsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
