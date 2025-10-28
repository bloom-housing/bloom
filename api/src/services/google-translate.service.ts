import { Injectable } from '@nestjs/common';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { LanguagesEnum } from '@prisma/client';

@Injectable()
export class GoogleTranslateService {
  public isConfigured(): boolean {
    const { GOOGLE_API_ID, GOOGLE_API_EMAIL, GOOGLE_API_KEY } = process.env;
    return !!GOOGLE_API_KEY && !!GOOGLE_API_EMAIL && !!GOOGLE_API_ID;
  }
  public async fetch(values: string[], language: LanguagesEnum) {
    return await GoogleTranslateService.makeTranslateService().translate(
      values,
      {
        from: LanguagesEnum.en,
        to: language,
        format: 'html',
      },
    );
  }

  private static makeTranslateService() {
    return new Translate({
      credentials: {
        private_key: process.env.GOOGLE_API_KEY.replace(/\\n/gm, '\n'),
        client_email: process.env.GOOGLE_API_EMAIL,
      },
      projectId: process.env.GOOGLE_API_ID,
    });
  }
}
