import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import {
  LanguagesEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { MailService } from '@sendgrid/mail';
import { EmailService } from '../../../src/services/email.service';
import { SendGridService } from '../../../src/services/sendgrid.service';
import { TranslationService } from '../../../src/services/translation.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { translationFactory } from '../../../prisma/seed-helpers/translation-factory';
import { whiteHouse } from '../../../prisma/seed-helpers/address-factory';
import { Application } from '../../../src/dtos/applications/application.dto';
import { User } from '../../../src/dtos/users/user.dto';

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
  } as unknown as User;

  it('testing welcome email', async () => {
    await service.welcome(
      [{ name: 'test', id: '1234' }],
      user as unknown as User,
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

  it('testing change email', async () => {
    await service.changeEmail(
      [{ name: 'test', id: '1234' }],
      user,
      'http://localhost:3001',
      'http://localhost:3001/confirmation',
      'newemail@example.com',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual('newemail@example.com');
    expect(sendMock.mock.calls[0][0].subject).toEqual(
      'Bloom email change request',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      'An email address change has been requested for your account.',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      'To confirm the change to your email address, please click the link below:',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      '<a href="http://localhost:3001/confirmation">Confirm email change</a>',
    );
  });

  it('testing forgot password', async () => {
    await service.forgotPassword(
      [{ name: 'test', id: '1234' }],
      user,
      'http://localhost:3001',
      'resetToken',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('Forgot your password?');
    expect(sendMock.mock.calls[0][0].html).toContain(
      'A request to reset your Bloom Housing Portal website password for http://localhost:3001 has recently been made.',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      'If you did make this request, please click on the link below to reset your password:',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      '<a href="http://localhost:3001/reset-password?token&#x3D;resetToken">Change my password</a>',
    );
    expect(sendMock.mock.calls[0][0].html).toContain(
      'Your password won&#x27;t change until you access the link above and create a new one.',
    );
  });

  it('should send csv data email', async () => {
    await service.sendCSV(
      [{ name: 'test', id: '1234' }],
      user,
      'csv data goes here',
      'User Export',
      'a user export',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('User Export');
    expect(sendMock.mock.calls[0][0].html).toContain(
      'The attached file is a user export. If you have any questions, please reach out to your administrator.',
    );
    expect(sendMock.mock.calls[0][0].html).toContain('Hello,');
    expect(sendMock.mock.calls[0][0].html).toContain('User Export');
    expect(sendMock.mock.calls[0][0].attachments).toEqual([
      {
        type: 'text/csv',
        content: expect.anything(),
        disposition: 'attachment',
        filename: expect.anything(),
      },
    ]);
  });

  describe('application confirmation', () => {
    const listing = {
      id: 'listingId',
      name: 'test listing',
      reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
      status: ListingsStatusEnum.active,
      jurisdictions: { name: 'test jurisdiction', id: 'jurisdictionId' },
      displayWaitlistSize: false,
      showWaitlist: false,
      applicationMethods: [],
      assets: [],
      listingEvents: [],
      units: [],
      referralApplication: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      listingsBuildingAddress: {
        ...whiteHouse,
        id: 'addressId',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    const application = {
      language: LanguagesEnum.en,
      applicant: {
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        emailAddress: 'applicant.email@example.com',
      },
    } as Application;
    it('Test first come first serve', async () => {
      await service.applicationConfirmation(
        listing,
        application,
        'http://localhost:3001',
      );
      expect(sendMock).toHaveBeenCalled();
      expect(sendMock.mock.calls[0][0].to).toEqual(
        'applicant.email@example.com',
      );
      expect(sendMock.mock.calls[0][0].subject).toEqual(
        'Your Application Confirmation',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].html).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].html).toContain(
        'Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'Housing preferences, if applicable, will affect first come first serve order.',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
    });
    it('Test lottery', async () => {
      await service.applicationConfirmation(
        { ...listing, reviewOrderType: ReviewOrderTypeEnum.lottery },
        application,
        'http://localhost:3001',
      );
      expect(sendMock).toHaveBeenCalled();
      expect(sendMock.mock.calls[0][0].to).toEqual(
        'applicant.email@example.com',
      );
      expect(sendMock.mock.calls[0][0].subject).toEqual(
        'Your Application Confirmation',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].html).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].html).toContain(
        'Once the application period closes, eligible applicants will be placed in order based on lottery rank order.',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'Housing preferences, if applicable, will affect lottery rank order.',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'If you need to update information on your application, do not apply again. Instead, contact the agent for this listing',
      );
    });
    it('Test waitlist', async () => {
      await service.applicationConfirmation(
        { ...listing, reviewOrderType: ReviewOrderTypeEnum.waitlist },
        application,
        'http://localhost:3001',
      );
      expect(sendMock).toHaveBeenCalled();
      expect(sendMock.mock.calls[0][0].to).toEqual(
        'applicant.email@example.com',
      );
      expect(sendMock.mock.calls[0][0].subject).toEqual(
        'Your Application Confirmation',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].html).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].html).toContain(
        'Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'Housing preferences, if applicable, will affect waitlist order.',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(sendMock.mock.calls[0][0].html).toContain(
        'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist',
      );
    });
  });

  describe('request approval', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.requestApproval(
        { name: 'test', id: '1234' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual('Listing approval requested');
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/exygy/image/upload/v1692118607/core/bloom_housing_logo.png" alt="Bloom Housing Portal" width="254" height="137" />`,
      );
      expect(emailMock.html).toMatch('Hello,');
      expect(emailMock.html).toMatch('Listing approval requested');
      expect(emailMock.html).toMatch(
        `A Partner has submitted an approval request to publish the listing name listing.`,
      );
      expect(emailMock.html).toMatch('Please log into the');
      expect(emailMock.html).toMatch('Partners Portal');
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001/);
      expect(emailMock.html).toMatch(
        'and navigate to the listing detail page to review and publish.',
      );
      expect(emailMock.html).toMatch(
        'To access the listing after logging in, please click the link below',
      );
      expect(emailMock.html).toMatch('Review Listing');
      expect(emailMock.html).toMatch(
        /http:\/\/localhost:3001\/listings\/listingId/,
      );
      expect(emailMock.html).toMatch('Thank you,');
      expect(emailMock.html).toMatch('Bloom Housing Portal');
    });
  });

  describe('changes requested', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.changesRequested(
        { name: 'test', id: '1234' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual('Listing changes requested');
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/exygy/image/upload/v1692118607/core/bloom_housing_logo.png" alt="Bloom Housing Portal" width="254" height="137" />`,
      );
      expect(emailMock.html).toMatch('Listing changes requested');
      expect(emailMock.html).toMatch('Hello,');
      expect(emailMock.html).toMatch(
        `An administrator is requesting changes to the listing name listing. Please log into the `,
      );
      expect(emailMock.html).toMatch('Partners Portal');
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001/);

      expect(emailMock.html).toMatch(
        ' and navigate to the listing detail page to view the request and edit the listing.',
      );
      expect(emailMock.html).toMatch(
        'and navigate to the listing detail page to view the request and edit the listing.',
      );
      expect(emailMock.html).toMatch(/http:\/\/localhost:3001/);
      expect(emailMock.html).toMatch(
        'To access the listing after logging in, please click the link below',
      );
      expect(emailMock.html).toMatch('Edit Listing');
      expect(emailMock.html).toMatch(
        /http:\/\/localhost:3001\/listings\/listingId/,
      );
      expect(emailMock.html).toMatch('Thank you,');
      expect(emailMock.html).toMatch('Bloom Housing Portal');
    });
  });

  describe('published listing', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.listingApproved(
        { name: 'test jurisdiction', id: 'jurisdictionId' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        'http://localhost:3000',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual('New published listing');
      expect(emailMock.html).toMatch(
        `<img src="https://res.cloudinary.com/exygy/image/upload/v1692118607/core/bloom_housing_logo.png" alt="Bloom Housing Portal" width="254" height="137" />`,
      );
      expect(emailMock.html).toMatch('New published listing');
      expect(emailMock.html).toMatch('Hello,');
      expect(emailMock.html).toMatch(
        `The listing name listing has been approved and published by an administrator.`,
      );
      expect(emailMock.html).toMatch(
        'To view the published listing, please click on the link below',
      );
      expect(emailMock.html).toMatch('View Listing');
      expect(emailMock.html).toMatch(
        /http:\/\/localhost:3000\/listing\/listingId/,
      );
      expect(emailMock.html).toMatch('Thank you,');
      expect(emailMock.html).toMatch('Bloom Housing Portal');
    });
  });
});
