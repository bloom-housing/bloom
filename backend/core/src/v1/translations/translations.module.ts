import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Translation } from "./entities/translation.entity"
import { TranslationsService } from "./translations.service"
import { TranslationsController } from "./translations.controller"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [TypeOrmModule.forFeature([Translation]), forwardRef(() => AuthModule)],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
