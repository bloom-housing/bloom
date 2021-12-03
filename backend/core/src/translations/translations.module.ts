import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Translation } from "./entities/translation.entity"
import { TranslationsController } from "./translations.controller"
import { AuthModule } from "../auth/auth.module"
import { TranslationsService } from "./services/translations.service"
import { GoogleTranslateService } from "./services/google-translate.service"
import { GeneratedListingTranslation } from "./entities/generated-listing-translation.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Translation, GeneratedListingTranslation]),
    forwardRef(() => AuthModule),
  ],
  controllers: [TranslationsController],
  providers: [TranslationsService, GoogleTranslateService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
