import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { generateSingleUseCode } from '../../../src/utilities/generate-single-use-code';
import { AppModule } from '../../../src/modules/app.module';

describe('generateSingleUseCode', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('should generate mfa code of the specified length', () => {
    expect(generateSingleUseCode().length).toEqual(
      Number(process.env.MFA_CODE_LENGTH),
    );
  });
});
