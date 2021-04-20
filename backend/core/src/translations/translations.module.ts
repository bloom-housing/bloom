import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Translation } from "./entities/translation.entity"
import { TranslationsService } from "./translations.service"
import { TranslationsController } from "./translations.controller"

@Module({
  imports: [TypeOrmModule.forFeature([Translation])],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class UserModule {}
