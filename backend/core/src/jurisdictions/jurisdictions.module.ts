import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { Jurisdiction } from "./entities/jurisdiction.entity"
import { JurisdictionsController } from "./jurisdictions.controller"
import { JurisdictionResolverService } from "./services/jurisdiction-resolver.service"
import { JurisdictionsService } from "./services/jurisdictions.service"

@Module({
  imports: [TypeOrmModule.forFeature([Jurisdiction]), forwardRef(() => AuthModule)],
  controllers: [JurisdictionsController],
  providers: [JurisdictionsService, JurisdictionResolverService],
  exports: [JurisdictionResolverService],
})
export class JurisdictionsModule {}
