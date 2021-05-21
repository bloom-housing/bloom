import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable, NotFoundException } from "@nestjs/common"
import { Translation } from "./entities/translation.entity"
import { TranslationCreateDto, TranslationUpdateDto } from "./dto/translation.dto"
import { CountyCode } from "../shared/types/county-code"
import { Language } from "../shared/types/language-enum"

@Injectable()
export class TranslationsService extends AbstractServiceFactory<
  Translation,
  TranslationCreateDto,
  TranslationUpdateDto
>(Translation) {
  public async getTranslationByLanguageAndCountyCodeOrDefaultEn(
    language: Language,
    countyCode: CountyCode
  ) {
    try {
      return await this.findOne({
        where: {
          language,
          countyCode,
        },
      })
    } catch (e) {
      if (e instanceof NotFoundException && language != Language.en) {
        console.warn(`Fetching translations for ${language} failed, defaulting to english.`)
        return this.findOne({
          where: {
            language: Language.en,
            countyCode,
          },
        })
      } else {
        throw e
      }
    }
  }
}
