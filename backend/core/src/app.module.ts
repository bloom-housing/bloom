import { Module } from "@nestjs/common"
import { ListingsController } from "./listings/listings.controller"
import { ListingsService } from "./listings/listings.service"
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
import { ApplicationsController } from "./applications/applications.controller"
import { ApplicationsService } from "./applications/applications.service"
import { Application } from "./entity/application.entity"
import { UserApplicationsController } from "./user-applications/user-applications.controller"
import { UserApplicationsService } from "./user-applications/user-applications.service"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbOptions,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Listing, Attachment, Preference, Unit, Application]),
    UserModule,
    AuthModule,
  ],
  controllers: [ListingsController, ApplicationsController, UserApplicationsController],
  providers: [ListingsService, ApplicationsService, UserApplicationsService],
})
export class AppModule {}
