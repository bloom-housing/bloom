import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable, Scope } from "@nestjs/common"
import { Translation } from "./entities/translation.entity"
import { TranslationCreateDto, TranslationUpdateDto } from "./dto/translation.dto"
import { CountyCode } from "../shared/types/county-code"
import { Language } from "../shared/types/language-enum"

@Injectable({ scope: Scope.REQUEST })
export class TranslationsService extends AbstractServiceFactory<
  Translation,
  TranslationCreateDto,
  TranslationUpdateDto
>(Translation) {
  public async getTranslationByLanguageAndCountyCode(language: Language, countyCode: CountyCode) {
    return this.list({
      where: {
        language,
        countyCode,
      },
    })
  }
}
