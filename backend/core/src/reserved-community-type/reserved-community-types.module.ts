import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "../auth/auth.module"
import { ReservedCommunityTypesController } from "./reserved-community-types.controller"
import { ReservedCommunityTypesService } from "./reserved-community-types.service"
import { ReservedCommunityType } from "./entities/reserved-community-type.entity"

@Module({
  imports: [TypeOrmModule.forFeature([ReservedCommunityType]), AuthModule],
  controllers: [ReservedCommunityTypesController],
  providers: [ReservedCommunityTypesService],
})
export class ReservedCommunityTypesModule {}
