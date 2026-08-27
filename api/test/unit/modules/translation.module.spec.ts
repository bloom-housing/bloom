import { Test } from '@nestjs/testing';
import { TranslationModule } from '../../../src/modules/translation.module';
import { TranslationService } from '../../../src/services/translation.service';

describe('TranslationModule', () => {
  it('resolves everything TranslationService asks for', async () => {
    const module = await Test.createTestingModule({
      imports: [TranslationModule],
    }).compile();

    expect(module.get(TranslationService)).toBeInstanceOf(TranslationService);
  });
});
