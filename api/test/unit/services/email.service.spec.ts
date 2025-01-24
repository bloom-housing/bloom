import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import {
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { EmailService } from '../../../src/services/email.service';
import { TranslationService } from '../../../src/services/translation.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { translationFactory } from '../../../prisma/seed-helpers/translation-factory';
import { yellowstoneAddress } from '../../../prisma/seed-helpers/address-factory';
import { Application } from '../../../src/dtos/applications/application.dto';
import { User } from '../../../src/dtos/users/user.dto';
import { ApplicationCreate } from '../../../src/dtos/applications/application-create.dto';
import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { mockClient } from 'aws-sdk-client-mock';
import {
  SendBulkEmailCommand,
  SendEmailCommand,
  SESv2Client,
} from '@aws-sdk/client-sesv2';
import 'aws-sdk-client-mock-jest';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

let govSendMock;
const translationServiceMock = {
  getMergedTranslations: () => {
    return translationFactory().translations;
  },
};

const jurisdictionServiceMock = {
  findOne: () => {
    return { name: 'Jurisdiction 1', publicUrl: 'https://example.com' };
  },
};
const httpServiceMock = {
  request: jest.fn().mockReturnValue(
    of({
      status: 200,
      statusText: 'OK',
    }),
  ),
};

describe('Testing email service', () => {
  let service: EmailService;
  let module: TestingModule;
  const mockSeSClient = mockClient(SESv2Client);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        EmailService,
        {
          provide: TranslationService,
          useValue: translationServiceMock,
        },
        {
          provide: JurisdictionService,
          useValue: jurisdictionServiceMock,
        },
        { provide: HttpService, useValue: httpServiceMock },
        Logger,
        GoogleTranslateService,
      ],
    }).compile();
  });

  beforeEach(async () => {
    jest.useFakeTimers();
    mockSeSClient.reset();
    mockSeSClient.on(SendEmailCommand).resolves({
      MessageId: randomUUID(),
      $metadata: {
        httpStatusCode: 200,
      },
    });
    mockSeSClient.on(SendBulkEmailCommand).resolves({
      BulkEmailEntryResults: [],
      $metadata: {
        httpStatusCode: 200,
      },
    });
    govSendMock = jest.fn();
    service = await module.resolve(EmailService);
    service.govSend = govSendMock;
  });

  const user = {
    firstName: 'Bloom',
    lastName: 'Bloomington',
    email: 'bloom.bloomington@example.com',
    language: LanguagesEnum.en,
  } as unknown as User;

  it('testing welcome email', async () => {
    await service.welcome(
      'test',
      user as unknown as User,
      'http://localhost:3000',
      'http://localhost:3000/?token=',
    );

    expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
      FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
      Destination: { ToAddresses: [user.email] },
      Content: {
        Simple: {
          Subject: {
            Data: 'Welcome',
          },
          Body: {
            Html: {
              Data: expect.stringContaining(
                'Thank you for setting up your account on http://localhost:3000.',
              ),
            },
          },
        },
      },
    });
  });

  it('testing invite email', async () => {
    await service.invitePartnerUser(
      [
        { name: 'test', id: '1234' },
        { name: 'second one', id: '2345' },
      ],
      user,
      'http://localhost:3001',
      'http://localhost:3001/?token=',
    );
    expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
      FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
      Destination: { ToAddresses: [user.email] },
      Content: {
        Simple: {
          Subject: {
            Data: 'Welcome to the Partners Portal',
          },
          Body: {
            Html: {
              Data: expect.stringMatching(
                'Welcome to the Partners Portal at http://localhost:300(\n|.)*You will now be able to manage listings and applications that you are a part of from one centralized location',
              ),
            },
          },
        },
      },
    });
  });

  it('testing change email', async () => {
    await service.changeEmail(
      'test',
      user,
      'http://localhost:3001',
      'http://localhost:3001/confirmation',
      'newemail@example.com',
    );
    expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
      FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
      Destination: { ToAddresses: ['newemail@example.com'] },
      Content: {
        Simple: {
          Subject: {
            Data: 'Doorway email change request',
          },
          Body: {
            Html: {
              Data: expect.anything(),
            },
          },
        },
      },
    });

    const html =
      mockSeSClient.call(0).args[0].input['Content']['Simple']['Body']['Html'][
        'Data'
      ];
    expect(html).toContain(
      'An email address change has been requested for your account.',
    );
    expect(html).toContain(
      'To confirm the change to your email address, please click the link below:',
    );
    expect(html).toContain(
      '<a href="http://localhost:3001/confirmation">Confirm email change</a>',
    );
  });

  it('testing forgot password', async () => {
    await service.forgotPassword(
      [
        { name: 'test', id: '1234' },
        { name: 'second', id: '1234' },
        { name: 'third', id: '1234' },
      ],
      user,
      'http://localhost:3001',
      'resetToken',
    );
    expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
      FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
      Destination: { ToAddresses: ['bloom.bloomington@example.com'] },
      Content: {
        Simple: {
          Subject: {
            Data: 'Forgot your password?',
          },
          Body: {
            Html: {
              Data: expect.anything(),
            },
          },
        },
      },
    });
    const html =
      mockSeSClient.call(0).args[0].input['Content']['Simple']['Body']['Html'][
        'Data'
      ];
    expect(html).toContain(
      'A request to reset your Bloom Housing Portal website password for http://localhost:3001 has recently been made',
    );
    expect(html).toContain(
      'If you did make this request, please click on the link below to reset your password:',
    );
    expect(html).toContain(
      '<a href="http://localhost:3001/reset-password?token&#x3D;resetToken">Change my password</a>',
    );
    expect(html).toContain(
      'Your password won&#x27;t change until you access the link above and create a new one.',
    );
  });

  it('testing forgot password with query params', async () => {
    await service.forgotPassword(
      [
        { name: 'test', id: '1234' },
        { name: 'second', id: '1234' },
        { name: 'third', id: '1234' },
      ],
      user,
      'http://localhost:3001?redirectUrl=redirect&listingId=123',
      'resetToken',
    );
    expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
      FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
      Destination: { ToAddresses: [user.email] },
      Content: {
        Simple: {
          Subject: {
            Data: 'Forgot your password?',
          },
          Body: {
            Html: {
              Data: expect.anything(),
            },
          },
        },
      },
    });
    const html =
      mockSeSClient.call(0).args[0].input['Content']['Simple']['Body']['Html'][
        'Data'
      ];
    expect(html).toContain(
      'A request to reset your Bloom Housing Portal website password for http://localhost:3001 has recently been made',
    );
    expect(html).toContain(
      'If you did make this request, please click on the link below to reset your password:',
    );
    expect(html).toContain(
      '<a href="http://localhost:3001/reset-password?token&#x3D;resetToken&amp;redirectUrl&#x3D;redirect&amp;listingId&#x3D;123">Change my password</a>',
    );
    expect(html).toContain(
      'Your password won&#x27;t change until you access the link above and create a new one.',
    );
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
        ...yellowstoneAddress,
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
        application as ApplicationCreate,
        'http://localhost:3001',
      );
      expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        Destination: { ToAddresses: ['applicant.email@example.com'] },
        Content: {
          Simple: {
            Subject: {
              Data: 'Your Application Confirmation',
            },
            Body: {
              Html: {
                Data: expect.anything(),
              },
            },
          },
        },
      });
      const html =
        mockSeSClient.call(0).args[0].input['Content']['Simple']['Body'][
          'Html'
        ]['Data'];
      expect(html).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(html).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(html).toContain('What happens next?');
      expect(html).toContain(
        'Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.',
      );
      expect(html).toContain(
        'Housing preferences, if applicable, will affect first come first serve order.',
      );
      expect(html).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
    });
    it('Test lottery', async () => {
      await service.applicationConfirmation(
        { ...listing, reviewOrderType: ReviewOrderTypeEnum.lottery },
        application as ApplicationCreate,
        'http://localhost:3001',
      );
      expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        Destination: { ToAddresses: ['applicant.email@example.com'] },
        Content: {
          Simple: {
            Subject: {
              Data: 'Your Application Confirmation',
            },
            Body: {
              Html: {
                Data: expect.anything(),
              },
            },
          },
        },
      });
      const html =
        mockSeSClient.call(0).args[0].input['Content']['Simple']['Body'][
          'Html'
        ]['Data'];
      expect(html).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(html).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(html).toContain('What happens next?');
      expect(html).toContain(
        'Once the application period closes, eligible applicants will be placed in order based on lottery rank order.',
      );
      expect(html).toContain(
        'Housing preferences, if applicable, will affect lottery rank order.',
      );
      expect(html).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(html).toContain(
        'If you’re not changing the primary applicant or any household members, you can just submit another application.  We’ll take the last one submitted, per the duplicate application policy.',
      );
    });
    it('Test waitlist', async () => {
      await service.applicationConfirmation(
        { ...listing, reviewOrderType: ReviewOrderTypeEnum.waitlist },
        application as ApplicationCreate,
        'http://localhost:3001',
      );
      expect(mockSeSClient).toHaveReceivedCommandWith(SendEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        Destination: { ToAddresses: ['applicant.email@example.com'] },
        Content: {
          Simple: {
            Subject: {
              Data: 'Your Application Confirmation',
            },
            Body: {
              Html: {
                Data: expect.anything(),
              },
            },
          },
        },
      });
      const html =
        mockSeSClient.call(0).args[0].input['Content']['Simple']['Body'][
          'Html'
        ]['Data'];
      expect(html).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(html).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(html).toContain('What happens next?');
      expect(html).toContain(
        'Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.',
      );
      expect(html).toContain(
        'Housing preferences, if applicable, will affect waitlist order.',
      );
      expect(html).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(html).toContain(
        'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist',
      );
    });
  });

  describe('request approval', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@example.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.requestApproval(
        { name: 'test', id: '1234' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        'http://localhost:3001',
      );
      expect(mockSeSClient).toHaveReceivedCommandWith(SendBulkEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        BulkEmailEntries: expect.arrayContaining([
          { Destination: { ToAddresses: ['testOne@example.com'] } },
          { Destination: { ToAddresses: ['testTwo@example.com'] } },
        ]),
        DefaultContent: {
          Template: {
            TemplateContent: {
              Subject: `Listing approval requested`,
              Html: expect.anything(),
            },
            TemplateData: expect.anything(),
          },
        },
      });

      const html =
        mockSeSClient.call(0).args[0].input['DefaultContent']['Template'][
          'TemplateContent'
        ]['Html'];
      expect(html).toMatch(
        `<img src="https://housingbayarea.mtc.ca.gov/images/doorway-logo.png" alt="Bloom Housing Portal" width="300" height="65" class="header-image"/>`,
      );

      expect(html).toMatch('Hello,');
      expect(html).toMatch('Listing approval requested');
      expect(html).toMatch(
        `A Partner has submitted an approval request to publish the listing name listing.`,
      );
      expect(html).toMatch('Please log into the');
      expect(html).toMatch('Partners Portal');
      expect(html).toMatch(/http:\/\/localhost:3001/);
      expect(html).toMatch(
        'and navigate to the listing detail page to review and publish.',
      );
      expect(html).toMatch(
        'To access the listing after logging in, please click the link below',
      );
      expect(html).toMatch('Review Listing');
      expect(html).toMatch(/http:\/\/localhost:3001\/listings\/listingId/);
      expect(html).toMatch('Thank you,');
      expect(html).toMatch('Bloom Housing Portal');
    });
  });

  describe('changes requested', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@example.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.changesRequested(
        { firstName: 'test', id: '1234' } as User,
        { name: 'listing name', id: 'listingId', juris: 'jurisId' },
        emailArr,
        'http://localhost:3001',
      );

      expect(mockSeSClient).toHaveReceivedCommandWith(SendBulkEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        BulkEmailEntries: expect.arrayContaining([
          { Destination: { ToAddresses: ['testOne@example.com'] } },
          { Destination: { ToAddresses: ['testTwo@example.com'] } },
        ]),
        DefaultContent: {
          Template: {
            TemplateContent: {
              Subject: `Listing changes requested`,
              Html: expect.anything(),
            },
            TemplateData: expect.anything(),
          },
        },
      });

      const html =
        mockSeSClient.call(0).args[0].input['DefaultContent']['Template'][
          'TemplateContent'
        ]['Html'];
      expect(html).toMatch(
        `<img src="https://housingbayarea.mtc.ca.gov/images/doorway-logo.png" alt="Bloom Housing Portal" width="300" height="65" class="header-image"/>`,
      );
      expect(html).toMatch('Listing changes requested');
      expect(html).toMatch('Hello,');
      expect(html).toMatch(
        `An administrator is requesting changes to the listing name listing. Please log into the `,
      );
      expect(html).toMatch('Partners Portal');
      expect(html).toMatch(/http:\/\/localhost:3001/);

      expect(html).toMatch(
        ' and navigate to the listing detail page to view the request and edit the listing.',
      );
      expect(html).toMatch(
        'and navigate to the listing detail page to view the request and edit the listing.',
      );
      expect(html).toMatch(/http:\/\/localhost:3001/);
      expect(html).toMatch(
        'To access the listing after logging in, please click the link below',
      );
      expect(html).toMatch('Edit Listing');
      expect(html).toMatch(/http:\/\/localhost:3001\/listings\/listingId/);
      expect(html).toMatch('Thank you,');
      expect(html).toMatch('Bloom Housing Portal');
    });
  });

  describe('published listing', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@example.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.listingApproved(
        { name: 'test jurisdiction', id: 'jurisdictionId' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        'http://localhost:3000',
      );

      expect(mockSeSClient).toHaveReceivedCommandWith(SendBulkEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        BulkEmailEntries: expect.arrayContaining([
          { Destination: { ToAddresses: ['testOne@example.com'] } },
          { Destination: { ToAddresses: ['testTwo@example.com'] } },
        ]),
        DefaultContent: {
          Template: {
            TemplateContent: {
              Subject: `New published listing`,
              Html: expect.anything(),
            },
            TemplateData: expect.anything(),
          },
        },
      });

      const html =
        mockSeSClient.call(0).args[0].input['DefaultContent']['Template'][
          'TemplateContent'
        ]['Html'];

      expect(html).toMatch(
        `<img src="https://housingbayarea.mtc.ca.gov/images/doorway-logo.png" alt="Bloom Housing Portal" width="300" height="65" class="header-image"/>`,
      );
      expect(html).toMatch('New published listing');
      expect(html).toMatch('Hello,');
      expect(html).toMatch(
        `The listing name listing has been approved and published by an administrator.`,
      );
      expect(html).toMatch(
        'To view the published listing, please click on the link below',
      );
      expect(html).toMatch('View Listing');
      expect(html).toMatch(/http:\/\/localhost:3000\/listing\/listingId/);
      expect(html).toMatch('Thank you,');
      expect(html).toMatch('Bloom Housing Portal');
    });

    it('should notify people of listing opportunity', async () => {
      const listing = {
        id: 'listingId',
        name: 'test listing',
        reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
        applicationDueDate: new Date(),
        status: ListingsStatusEnum.active,
        jurisdictions: { name: 'test jurisdiction', id: 'jurisdictionId' },
        displayWaitlistSize: false,
        showWaitlist: false,
        applicationMethods: [],
        assets: [],
        listingEvents: [
          {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: new Date(),
          },
        ],
        units: [],
        referralApplication: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        listingsBuildingAddress: {
          ...yellowstoneAddress,
          id: 'addressId',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      const service = await module.resolve(EmailService);
      await service.listingOpportunity(listing);

      const emailMock = govSendMock.mock.calls[0][0];
      expect(emailMock).toMatch(
        '<span class="intro">Rental opportunity at</span> <br />test listing',
      );
      expect(emailMock).toMatch(
        'Please view listing for the most updated information',
      );
      expect(emailMock).toMatch(
        /<td class="bold">\s*Applications Due\s*<\/td>/,
      );
      expect(emailMock).toMatch(
        new RegExp(
          `<td class="bold">\\s*${dayjs(listing.applicationDueDate)
            .tz(process.env.TIME_ZONE)
            .format('MMMM D, YYYY [at] h:mma z')}\\s*</td>`,
        ),
      );
      expect(emailMock).toMatch(/<td class="bold">\s*Address\s*<\/td>/);
      expect(emailMock).toMatch(
        /<td>\s*3200 Old Faithful Inn Rd, Yellowstone National Park WY 82190\s*<\/td>/,
      );
    });
  });

  describe('lottery published for applicant', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@example.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.lotteryPublishedApplicant(
        { name: 'listing name', id: 'listingId', juris: 'jurisdictionId' },
        { en: emailArr },
      );

      expect(mockSeSClient).toHaveReceivedCommandWith(SendBulkEmailCommand, {
        FromEmailAddress: 'Doorway <no-reply@housingbayarea.org>',
        BulkEmailEntries: expect.arrayContaining([
          { Destination: { ToAddresses: ['testOne@example.com'] } },
          { Destination: { ToAddresses: ['testTwo@example.com'] } },
        ]),
        DefaultContent: {
          Template: {
            TemplateContent: {
              Subject: `New Housing Lottery Results Available`,
              Html: expect.anything(),
            },
            TemplateData: expect.anything(),
          },
        },
      });
      const html =
        mockSeSClient.call(0).args[0].input['DefaultContent']['Template'][
          'TemplateContent'
        ]['Html'];

      expect(html).toMatch(/href="https:\/\/example\.com\/en\/sign-in"/);
      expect(html).toMatch(/please visit https:\/\/example\.com/);
    });
  });
});
