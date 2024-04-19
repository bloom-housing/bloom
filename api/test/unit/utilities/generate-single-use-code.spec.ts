import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { generateSingleUseCode } from '../../../src/utilities/generate-single-use-code';
import { AppModule } from '../../../src/modules/app.module';

describe('generateSingleUseCode', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should generate mfa code of the specified length', () => {
    expect(generateSingleUseCode().length).toEqual(
      Number(process.env.MFA_CODE_LENGTH),
    );
  });
});
