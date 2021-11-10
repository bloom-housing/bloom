import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ProgramsService } from "./programs.service"
import { Listing } from "../listings/entities/listing.entity"
import { Program } from "./entities/program.entity"
import { AuthModule } from "../auth/auth.module"
import { ProgramsController } from "./programs.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Listing, Program]), AuthModule],
  providers: [ProgramsService],
  exports: [ProgramsService],
  controllers: [ProgramsController],
})
export class ProgramsModule {}
