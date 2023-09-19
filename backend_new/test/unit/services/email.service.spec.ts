import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { LanguagesEnum } from '@prisma/client';
import { MailService } from '@sendgrid/mail';
import { EmailService } from '../../../src/services/email.service';
import { SendGridService } from '../../../src/services/sendgrid.service';
import { TranslationService } from '../../../src/services/translation.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { translationFactory } from '../../../prisma/seed-helpers/translation-factory';

let sendMock;
const translationServiceMock = {
  getMergedTranslations: () => {
    return translationFactory().translations;
  },
};

const jurisdictionServiceMock = {
  findOne: (id) => {
    return { name: 'Jurisdiction 1' };
  },
};

describe('Testing email service', () => {
  let service: EmailService;
  let module: TestingModule;
  let sendGridService: SendGridService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        EmailService,
        SendGridService,
        MailService,
        {
          provide: TranslationService,
          useValue: translationServiceMock,
        },
        {
          provide: JurisdictionService,
          useValue: jurisdictionServiceMock,
        },
        GoogleTranslateService,
      ],
    }).compile();
  });

  beforeEach(async () => {
    jest.useFakeTimers();
    sendGridService = module.get<SendGridService>(SendGridService);
    sendMock = jest.fn();
    sendGridService.send = sendMock;
    service = await module.resolve(EmailService);
  });

  const user = {
    firstName: 'Bloom',
    lastName: 'Bloomington',
    email: 'bloom.bloomington@example.com',
    language: LanguagesEnum.en,
  };

  it('testing welcome email', async () => {
    await service.welcome(
      [{ name: 'test', id: '1234' }],
      user,
      'http://localhost:3000',
      'http://localhost:3000/?token=',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('Welcome');
    expect(sendMock.mock.calls[0][0].html).toContain(
      'Thank you for setting up your account on http://localhost:3000.',
    );
  });

  it('testing invite email', async () => {
    await service.invitePartnerUser(
      [{ name: 'test', id: '1234' }],
      user,
      'http://localhost:3001',
      'http://localhost:3001/?token=',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual(
      'Welcome to the Partners Portal',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      'Welcome to the Partners Portal at http://localhost:3001',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      'You will now be able to manage listings and applications that you are a part of from one centralized location.',
    );
  });
});
