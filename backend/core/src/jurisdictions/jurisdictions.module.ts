import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { Jurisdiction } from "./entities/jurisdiction.entity"
import { JurisdictionsController } from "./jurisdictions.controller"
import { JurisdictionsService } from "./services/jurisdictions.service"

@Module({
  imports: [TypeOrmModule.forFeature([Jurisdiction]), AuthModule],
  controllers: [JurisdictionsController],
  providers: [JurisdictionsService],
})
export class JurisdictionsModule {}
