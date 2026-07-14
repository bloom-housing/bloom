import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  LanguagesEnum,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  RegionEnum,
  ReviewOrderTypeEnum,
  UnitTypeEnum,
} from '@prisma/client';
import {
  EmailService,
  ListingNotificationVariant,
} from '../../../src/services/email.service';
import { EmailProvider } from '../../../src/services/email-provider.service';
import { GovDeliveryService } from '../../../src/services/gov-delivery.service';
import { TranslationService } from '../../../src/services/translation.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { translationFactory } from '../../../prisma/seed-helpers/translation-factory';
import { yellowstoneAddress } from '../../../prisma/seed-helpers/address-factory';
import { Application } from '../../../src/dtos/applications/application.dto';
import { User } from '../../../src/dtos/users/user.dto';
import { Logger } from '@nestjs/common';
import { ApplicationStatusChangeItem } from 'src/utilities/applicationStatusChanges';
import Listing from 'src/dtos/listings/listing.dto';
import {
  ListingUnitsSummary,
  oneLineAddress,
} from '../../../src/utilities/listing-data-formatters';
import { UnitAccessibilityPriorityTypeEnum } from '../../../src/enums/units/accessibility-priority-type-enum';

let sendMock;
let govDeliverySendMock;
const translationServiceMock = {
  getMergedTranslations: () => {
    return translationFactory().translations;
  },
};

const jurisdictionServiceMock = {
  findOne: () => {
    return {
      id: 'jurisdictionId',
      name: 'Jurisdiction 1',
      publicUrl: 'https://example.com',
    };
  },
};

describe('Testing email service', () => {
  let service: EmailService;
  let module: TestingModule;
  let emailProvider: EmailProvider;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        EmailProvider,
        EmailService,
        Logger,
        {
          provide: TranslationService,
          useValue: translationServiceMock,
        },
        {
          provide: JurisdictionService,
          useValue: jurisdictionServiceMock,
        },
        {
          provide: GovDeliveryService,
          useValue: { send: jest.fn() },
        },
        GoogleTranslateService,
      ],
    }).compile();
  });

  beforeEach(async () => {
    jest.useFakeTimers();
    emailProvider = module.get<EmailProvider>(EmailProvider);
    sendMock = jest.fn();
    emailProvider.send = sendMock;
    const govDeliveryService =
      module.get<GovDeliveryService>(GovDeliveryService);
    govDeliverySendMock = jest.fn();
    govDeliveryService.send = govDeliverySendMock;
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
      'test',
      user as unknown as User,
      'http://localhost:3000',
      'http://localhost:3000/?token=',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('Welcome');
    expect(sendMock.mock.calls[0][0].body).toContain(
      'Thank you for setting up your account on http://localhost:3000.',
    );
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
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual(
      'Welcome to the Partners Portal',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      'Welcome to the Partners Portal at http://localhost:3001',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      'You will now be able to manage listings and applications that you are a part of from one centralized location.',
    );
  });

  it('testing change email', async () => {
    await service.changeEmail(
      'test',
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
    expect(sendMock.mock.calls[0][0].body).toContain(
      'An email address change has been requested for your account.',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      'To confirm the change to your email address, please click the link below:',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
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
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('Forgot your password?');
    expect(sendMock.mock.calls[0][0].body).toContain(
      'A request to reset your Bloom Housing Portal website password for http://localhost:3001 has recently been made.',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      'If you did make this request, please click on the link below to reset your password:',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      '<a href="http://localhost:3001/reset-password?token&#x3D;resetToken">Change my password</a>',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
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
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('Forgot your password?');
    expect(sendMock.mock.calls[0][0].body).toContain(
      'A request to reset your Bloom Housing Portal website password for http://localhost:3001 has recently been made.',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      'If you did make this request, please click on the link below to reset your password:',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      '<a href="http://localhost:3001/reset-password?token&#x3D;resetToken&amp;redirectUrl&#x3D;redirect&amp;listingId&#x3D;123">Change my password</a>',
    );
    expect(sendMock.mock.calls[0][0].body).toContain(
      'Your password won&#x27;t change until you access the link above and create a new one.',
    );
  });

  it('should send csv data email', async () => {
    await service.sendCSV(
      [{ name: 'test', id: '1234' }],
      user,
      'csv data goes here',
      'User Export',
      'an export of all users',
    );
    expect(sendMock).toHaveBeenCalled();
    expect(sendMock.mock.calls[0][0].to).toEqual(user.email);
    expect(sendMock.mock.calls[0][0].subject).toEqual('User Export');
    expect(sendMock.mock.calls[0][0].body).toContain(
      'The attached file is an export of all users. If you have any questions, please reach out to your administrator.',
    );
    expect(sendMock.mock.calls[0][0].body).toContain('Hello,');
    expect(sendMock.mock.calls[0][0].body).toContain('User Export');
    expect(sendMock.mock.calls[0][0].attachment).toEqual({
      data: 'csv data goes here',
      name: expect.stringContaining('users-'),
      type: 'text/csv',
    });
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
      assets: {},
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
      applicationLotteryTotals: null,
    };
    const application = {
      language: LanguagesEnum.en,
      applicant: {
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        emailAddress: 'applicant.email@example.com',
      },
      alternateContact: {
        firstName: 'Housing',
        lastName: 'Advocate',
        emailAddress: 'advocate.email@example.com',
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
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Eligible applicants will be contacted on a first come first serve basis until vacancies are filled.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Housing preferences, if applicable, will affect first come first serve order.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
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
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Once the application period closes, eligible applicants will be placed in order based on lottery rank order.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Housing preferences, if applicable, will affect lottery rank order.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
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
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Eligible applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Housing preferences, if applicable, will affect waitlist order.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist',
      );
    });
    it('Test waitlistLottery', async () => {
      await service.applicationConfirmation(
        { ...listing, reviewOrderType: ReviewOrderTypeEnum.waitlistLottery },
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
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><img src="https://res.cloudinary.com/exygy/image/upload/v1652459517/core/step-left-active_vo3fnq.png" alt="indication of step completed" /></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        '<td class="step step-complete"><span class="step-label" aria-current="true">Application <br />received</span></td>',
      );
      expect(sendMock.mock.calls[0][0].body).toContain('What happens next?');
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Eligible applicants will be placed on the waitlist based on lottery rank order.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'Housing preferences, if applicable, will affect waitlist order.',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents',
      );
      expect(sendMock.mock.calls[0][0].body).toContain(
        'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist',
      );
    });

    it('Test leasing agent section with all fields present', async () => {
      const listingWithLeasingAgent = {
        ...listing,
        leasingAgentName: 'John Doe',
        leasingAgentTitle: 'Property Manager',
        leasingAgentPhone: '(555) 123-4567',
        leasingAgentEmail: 'john.doe@example.com',
        leasingAgentOfficeHours: 'Monday-Friday 9AM-5PM',
      };

      await service.applicationConfirmation(
        listingWithLeasingAgent,
        application,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailHtml = sendMock.mock.calls[0][0].body;

      expect(emailHtml).toContain('<h3>Property Manager</h3>');
      expect(emailHtml).toContain('John Doe<br />');
      expect(emailHtml).toContain('Property Manager<br />');
      expect(emailHtml).toContain('(555) 123-4567<br />');
      expect(emailHtml).toContain('john.doe@example.com<br />');

      expect(emailHtml).toContain('<h3>Office Hours:</h3>');
      expect(emailHtml).toContain('Monday-Friday 9AM-5PM');
    });

    it('Test leasing agent section with partial fields present', async () => {
      const listingWithPartialLeasingAgent = {
        ...listing,
        leasingAgentName: 'John Doe',
        leasingAgentPhone: '(555) 123-4567',
      };

      await service.applicationConfirmation(
        listingWithPartialLeasingAgent,
        application,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailHtml = sendMock.mock.calls[0][0].body;

      expect(emailHtml).toContain('<h3>Property Manager</h3>');
      expect(emailHtml).toContain('John Doe<br />');
      expect(emailHtml).toContain('(555) 123-4567<br />');

      expect(emailHtml).not.toContain('<h3>Office Hours:</h3>');
    });

    it('Test no property manager and office hours', async () => {
      await service.applicationConfirmation(
        listing,
        application,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailHtml = sendMock.mock.calls[0][0].body;

      expect(emailHtml).not.toContain('<h3>Property Manager</h3>');
      expect(emailHtml).not.toContain('<h3>Office Hours:</h3>');
    });

    it('sends email for advocate and applicant when submitted by advocate', async () => {
      await service.applicationConfirmation(
        {
          ...listing,
          reviewOrderType: ReviewOrderTypeEnum.waitlist,
          applicationLotteryTotals: [],
        },
        {
          ...application,
          language: LanguagesEnum.es,
        },
        'http://localhost:3001',
        true,
      );

      expect(sendMock).toHaveBeenCalledTimes(2);

      const advocateEmail = sendMock.mock.calls[0][0];
      expect(advocateEmail.to).toEqual('advocate.email@example.com');
      expect(advocateEmail.body).toContain('We got your application for');
      expect(advocateEmail.body).toContain(
        'If your client is contacted for an interview, they will be asked to fill out a more detailed application and provide supporting documents.',
      );
      expect(advocateEmail.body).toContain(
        'Your client may be contacted while on the waitlist to confirm that they wish to remain on the waitlist.',
      );
      expect(advocateEmail.body).toContain('Need to make updates?');
      expect(advocateEmail.body).toContain('See Listing');

      const applicantEmail = sendMock.mock.calls[1][0];
      expect(applicantEmail.to).toEqual('applicant.email@example.com');
      expect(applicantEmail.body).toContain(
        'We received an application on your behalf for',
      );
      expect(applicantEmail.body).toContain('<h2>Questions?</h2>');
      expect(applicantEmail.body).toContain(
        'If you have questions regarding this application, please contact the agent for this listing.',
      );
      expect(applicantEmail.body).toContain(
        'If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents.',
      );
      expect(applicantEmail.body).toContain(
        'You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist.',
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
        undefined,
        emailArr,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual(
        'Listing approval requested - listing name',
      );
      expect(emailMock.body).toMatch(
        `<img src="https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/bloom_logo_generic_zgb4sg.jpg" alt="Bloom Housing Portal" height="137" width="auto" />`,
      );

      expect(emailMock.body).toMatch('Hello,');
      expect(emailMock.body).toMatch('Listing approval requested');
      expect(emailMock.body).toMatch(
        `A Partner has submitted an approval request to publish the listing name listing.`,
      );
      expect(emailMock.body).not.toMatch('The listing file number is');
      expect(emailMock.body).toMatch('Please log into the');
      expect(emailMock.body).toMatch('Partners Portal');
      expect(emailMock.body).toMatch(/http:\/\/localhost:3001/);
      expect(emailMock.body).toMatch(
        'and navigate to the listing detail page to review and publish.',
      );
      expect(emailMock.body).toMatch(
        'To access the listing after logging in, please click the link below',
      );
      expect(emailMock.body).toMatch('Review Listing');
      expect(emailMock.body).toMatch(
        /http:\/\/localhost:3001\/listings\/listingId/,
      );
      expect(emailMock.body).toMatch('Thank you,');
      expect(emailMock.body).toMatch('Bloom Housing Portal');
    });

    it('should include the listing file number when present', async () => {
      const emailArr = ['testOne@xample.com'];
      const service = await module.resolve(EmailService);
      await service.requestApproval(
        { name: 'test', id: '1234' },
        { name: 'listing name', id: 'listingId' },
        'ABC-123',
        emailArr,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.body).toMatch(
        'A Partner has submitted an approval request to publish the listing name listing. The listing file number is ABC-123.',
      );
    });
  });

  describe('changes requested', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.changesRequested(
        {
          id: '1234',
          passwordUpdatedAt: undefined,
          passwordValidForDays: 0,
          email: '',
          firstName: '',
          lastName: '',
          jurisdictions: [],
          agreedToTermsOfService: false,
          createdAt: undefined,
          updatedAt: undefined,
        },
        { name: 'listing name', id: 'listingId', juris: 'jurisId' },
        emailArr,
        'http://localhost:3001',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual('Listing changes requested');
      expect(emailMock.body).toMatch(
        `<img src="https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/bloom_logo_generic_zgb4sg.jpg" alt="Bloom Housing Portal" height="137" width="auto" />`,
      );
      expect(emailMock.body).toMatch('Listing changes requested');
      expect(emailMock.body).toMatch('Hello,');
      expect(emailMock.body).toMatch(
        `An administrator is requesting changes to the listing name listing. Please log into the `,
      );
      expect(emailMock.body).toMatch('Partners Portal');
      expect(emailMock.body).toMatch(/http:\/\/localhost:3001/);

      expect(emailMock.body).toMatch(
        ' and navigate to the listing detail page to view the request and edit the listing.',
      );
      expect(emailMock.body).toMatch(
        'and navigate to the listing detail page to view the request and edit the listing.',
      );
      expect(emailMock.body).toMatch(/http:\/\/localhost:3001/);
      expect(emailMock.body).toMatch(
        'To access the listing after logging in, please click the link below',
      );
      expect(emailMock.body).toMatch('Edit Listing');
      expect(emailMock.body).toMatch(
        /http:\/\/localhost:3001\/listings\/listingId/,
      );
      expect(emailMock.body).toMatch('Thank you,');
      expect(emailMock.body).toMatch('Bloom Housing Portal');
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
      expect(emailMock.subject).toEqual('New published listing - listing name');
      expect(emailMock.body).toMatch(
        `<img src="https://res.cloudinary.com/exygy/image/upload/w_400,c_limit,q_65/dev/bloom_logo_generic_zgb4sg.jpg" alt="Bloom Housing Portal" height="137" width="auto" />`,
      );
      expect(emailMock.body).toMatch('New published listing');
      expect(emailMock.body).toMatch('Hello,');
      expect(emailMock.body).toMatch(
        `The listing name listing has been approved and published by an administrator.`,
      );
      expect(emailMock.body).toMatch(
        'To view the published listing, please click on the link below',
      );
      expect(emailMock.body).toMatch('View Listing');
      expect(emailMock.body).toMatch(
        /http:\/\/localhost:3000\/listing\/listingId/,
      );
      expect(emailMock.body).toMatch('Thank you,');
      expect(emailMock.body).toMatch('Bloom Housing Portal');
    });
  });

  describe('scheduled listing', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.listingScheduled(
        { name: 'test jurisdiction', id: 'jurisdictionId' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        new Date('2026-07-15T12:00:00.000Z'),
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual('New scheduled listing - listing name');
      expect(emailMock.body).toMatch('New scheduled listing');
      expect(emailMock.body).toMatch('Hello,');
      expect(emailMock.body).toMatch(
        'The listing name listing has been approved by an administrator and is scheduled to be automatically published on 07/15/2026 between 12:00 AM and 2:00 AM. If you have questions or require changes, please contact an administrator.',
      );
      expect(emailMock.body).toMatch('Thank you,');
      expect(emailMock.body).toMatch('Bloom Housing Portal');
    });
  });

  describe('auto-published listing', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.listingPublished(
        { name: 'test jurisdiction', id: 'jurisdictionId' },
        { name: 'listing name', id: 'listingId' },
        emailArr,
        'http://localhost:3000',
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual('New published listing - listing name');
      expect(emailMock.body).toMatch('New published listing');
      expect(emailMock.body).toMatch('Hello,');
      expect(emailMock.body).toMatch(
        'The listing name listing has been automatically published.',
      );
      expect(emailMock.body).toMatch(
        'To view the published listing, please click on the link below',
      );
      expect(emailMock.body).toMatch('View Listing');
      expect(emailMock.body).toMatch(
        /http:\/\/localhost:3000\/listing\/listingId/,
      );
      expect(emailMock.body).toMatch('Thank you,');
      expect(emailMock.body).toMatch('Bloom Housing Portal');
    });
  });

  describe('application update', () => {
    const mockContactEmail = 'email@email.com';

    beforeEach(() => {
      process.env.CONTACT_EMAIL = mockContactEmail;
    });

    it('should send application update email for applicant', async () => {
      const listing = {
        id: 'listingId',
        name: 'Example Listing',
        jurisdictions: { name: 'Jurisdiction 1', id: 'jurisdictionId' },
      } as Listing;
      const application = {
        language: LanguagesEnum.en,
        applicant: {
          firstName: 'First',
          lastName: 'Last',
          emailAddress: 'applicant.email@example.com',
        },
      } as Application;
      const changes = [
        {
          type: 'status',
          from: ApplicationStatusEnum.submitted,
          to: ApplicationStatusEnum.waitlist,
        },
      ] as ApplicationStatusChangeItem[];

      await service.applicationUpdateEmail(
        listing.name,
        listing.jurisdictions,
        application,
        changes,
        'http://localhost:3000',
      );

      expect(sendMock).toHaveBeenCalledTimes(1);

      const applicantEmailMock = sendMock.mock.calls[0][0];
      expect(applicantEmailMock.to).toEqual('applicant.email@example.com');
      expect(applicantEmailMock.subject).toEqual(
        'Application update for Example Listing',
      );
      expect(applicantEmailMock.body).toContain(
        'To view your application, please click the link below:',
      );
      expect(applicantEmailMock.body).toContain('View my application');
      expect(applicantEmailMock.body).toMatch(
        'http://localhost:3000/account/applications',
      );
      expect(applicantEmailMock.body).toContain(
        'No further action is required at this time. If you have questions regarding this update, please reach out at',
      );
      expect(applicantEmailMock.body).toContain(mockContactEmail);
    });
    it('should send advocate and applicant application update emails', async () => {
      const listing = {
        id: 'listingId',
        name: 'Example Listing',
        jurisdictions: { name: 'Jurisdiction 1', id: 'jurisdictionId' },
      } as Listing;
      const application = {
        language: LanguagesEnum.es,
        applicant: {
          firstName: 'First',
          lastName: 'Last',
          emailAddress: 'applicant.email@example.com',
        },
        alternateContact: {
          firstName: 'Housing',
          lastName: 'Advocate',
          emailAddress: 'advocate.email@example.com',
        },
      } as Application;
      const changes = [
        {
          type: 'status',
          from: ApplicationStatusEnum.submitted,
          to: ApplicationStatusEnum.waitlist,
        },
        { type: 'accessibleWaitlist', value: '2' },
        { type: 'conventionalWaitlist', value: '5' },
      ] as ApplicationStatusChangeItem[];

      await service.applicationUpdateEmail(
        listing.name,
        listing.jurisdictions,
        application,
        changes,
        'http://localhost:3000',
        true,
        'advocate.email@example.com',
      );

      expect(sendMock).toHaveBeenCalledTimes(2);

      const advocateEmailMock = sendMock.mock.calls[0][0];
      expect(advocateEmailMock.to).toEqual('advocate.email@example.com');
      expect(advocateEmailMock.subject).toEqual(
        'Application update for Example Listing',
      );
      expect(advocateEmailMock.body).toContain(
        'Your application has been updated for Example Listing',
      );
      expect(advocateEmailMock.body).toContain(
        'Your application status has changed from <strong>Submitted</strong> to <strong>Wait list</strong>',
      );
      expect(advocateEmailMock.body).toContain(
        'Your Accessible wait list number is <strong>2</strong>',
      );
      expect(advocateEmailMock.body).toContain(
        'Your Conventional wait list number is <strong>5</strong>',
      );
      expect(advocateEmailMock.body).toContain(mockContactEmail);
      expect(advocateEmailMock.body).toMatch(
        'http://localhost:3000/account/applications',
      );

      const applicantEmailMock = sendMock.mock.calls[1][0];
      expect(applicantEmailMock.to).toEqual('applicant.email@example.com');
      expect(applicantEmailMock.subject).toEqual(
        'Application update for Example Listing',
      );
      expect(applicantEmailMock.body).toContain(
        'Your application has been updated for Example Listing',
      );
      expect(applicantEmailMock.body).toContain(
        'If you have questions regarding this update, please reach out at',
      );
      expect(applicantEmailMock.body).toContain(mockContactEmail);
      expect(applicantEmailMock.body).not.toMatch(
        'http://localhost:3000/account/applications',
      );
    });

    it('should include decline reason in application update email', async () => {
      const listing = {
        id: 'listingId',
        name: 'Example Listing',
        jurisdictions: { name: 'Jurisdiction 1', id: 'jurisdictionId' },
      } as Listing;
      const application = {
        language: LanguagesEnum.en,
        applicant: {
          firstName: 'First',
          lastName: 'Last',
          emailAddress: 'applicant.email@example.com',
        },
      } as Application;
      const changes = [
        {
          type: 'status',
          from: ApplicationStatusEnum.submitted,
          to: ApplicationStatusEnum.declined,
        },
        {
          type: 'declineReason',
          value: ApplicationDeclineReasonEnum.householdIncomeTooLow,
        },
      ] as ApplicationStatusChangeItem[];

      await service.applicationUpdateEmail(
        listing.name,
        listing.jurisdictions,
        application,
        changes,
        'http://localhost:3000',
      );

      expect(sendMock).toHaveBeenCalledTimes(1);

      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual('applicant.email@example.com');
      expect(emailMock.body).toContain(
        'Your application status has changed from <strong>Submitted</strong> to <strong>Declined</strong>',
      );
      expect(emailMock.body).toContain(
        'Your application decline reason is <strong>Household income too low</strong>',
      );
    });

    it('should include decline reason in advocate application update email', async () => {
      const listing = {
        id: 'listingId',
        name: 'Example Listing',
        jurisdictions: { name: 'Jurisdiction 1', id: 'jurisdictionId' },
      } as Listing;
      const application = {
        language: LanguagesEnum.en,
        applicant: {
          firstName: 'First',
          lastName: 'Last',
          emailAddress: 'applicant.email@example.com',
        },
        alternateContact: {
          firstName: 'Housing',
          lastName: 'Advocate',
          emailAddress: 'advocate.email@example.com',
        },
      } as Application;
      const changes = [
        {
          type: 'status',
          from: ApplicationStatusEnum.submitted,
          to: ApplicationStatusEnum.declined,
        },
        {
          type: 'declineReason',
          value: ApplicationDeclineReasonEnum.householdIncomeTooHigh,
        },
      ] as ApplicationStatusChangeItem[];

      await service.applicationUpdateEmail(
        listing.name,
        listing.jurisdictions,
        application,
        changes,
        'http://localhost:3000',
        true,
        'advocate.email@example.com',
      );

      expect(sendMock).toHaveBeenCalledTimes(2);

      const advocateEmailMock = sendMock.mock.calls[0][0];
      expect(advocateEmailMock.body).toContain(
        'Your application decline reason is <strong>Household income too high</strong>',
      );

      const applicantEmailMock = sendMock.mock.calls[1][0];
      expect(applicantEmailMock.body).toContain(
        'Your application decline reason is <strong>Household income too high</strong>',
      );
    });
  });

  describe('lottery published for applicant', () => {
    it('should generate html body', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const service = await module.resolve(EmailService);
      await service.lotteryPublishedApplicant(
        { name: 'listing name', id: 'listingId', juris: 'jurisdictionId' },
        { en: emailArr },
      );

      expect(sendMock).toHaveBeenCalled();
      const emailMock = sendMock.mock.calls[0][0];
      expect(emailMock.to).toEqual(emailArr);
      expect(emailMock.subject).toEqual(
        'New Housing Lottery Results Available',
      );
      expect(emailMock.body).toMatch(
        /href="https:\/\/example\.com\/en\/sign-in"/,
      );
      expect(emailMock.body).toMatch(/please visit https:\/\/example\.com/);
    });

    it('should load translations with jurisdiction for each language', async () => {
      const emailArr = ['testOne@xample.com', 'testTwo@example.com'];
      const getMergedTranslationsSpy = jest.spyOn(
        translationServiceMock,
        'getMergedTranslations',
      );
      const service = await module.resolve(EmailService);

      await service.lotteryPublishedApplicant(
        { name: 'listing name', id: 'listingId', juris: 'jurisdictionId' },
        { en: emailArr, es: ['spanish@example.com'] },
      );

      expect(getMergedTranslationsSpy).toHaveBeenCalledTimes(2);
      expect(getMergedTranslationsSpy).toHaveBeenNthCalledWith(
        1,
        'jurisdictionId',
        'en',
      );
      expect(getMergedTranslationsSpy).toHaveBeenNthCalledWith(
        2,
        'jurisdictionId',
        'es',
      );
    });
  });

  describe('listing rental opportunity details', () => {
    const LABELS = {
      community: 'Community',
      applicationsDue: 'Applications Due',
      applicationsOpen: 'Applications Open',
      address: 'Address',
      neighborhood: 'Neighborhood',
      unitType: 'Available accessible units',
      opportunityType: 'Opportunity type',
      rent: 'Rent',
      minIncome: 'Minimum Income',
      maxIncome: 'Maximum Income',
      lotteryDate: 'Lottery Date',
      studio: 'Studio',
      oneBdrm: '1 bedroom',
      twoBdrm: '2 bedroom',
      threeBdrm: '3 bedroom',
      region: 'Region',
    };

    const emptySummary = (): ListingUnitsSummary => ({
      units: {},
      flatRent: undefined,
      percentageRent: undefined,
      minIncome: undefined,
      maxIncome: undefined,
    });

    const baseListing = (overrides: Partial<Listing> = {}): Listing =>
      ({
        listingsBuildingAddress: yellowstoneAddress,
        listingEvents: [],
        ...overrides,
      } as Listing);

    const findByLabel = (
      rows: { label: string; value: string | number }[],
      label: string,
    ) => rows.find((r) => r.label === label);

    const buildDetails = (
      listing: Listing,
      priorityTypes: UnitAccessibilityPriorityTypeEnum[] = [],
      summary: ListingUnitsSummary = emptySummary(),
      variant?: ListingNotificationVariant,
    ) => service.buildListingDetails(listing, priorityTypes, summary, variant);

    beforeEach(() => {
      service.polyglot.replace(translationFactory().translations);
    });

    it('includes only address when all optional inputs are absent', () => {
      const result = buildDetails(baseListing(), [], emptySummary());
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe(LABELS.address);
      expect(result[0].value).toBe(
        oneLineAddress(
          yellowstoneAddress as Parameters<typeof oneLineAddress>[0],
        ),
      );
    });

    describe('conditional listing fields', () => {
      it('includes community row when reservedCommunityTypes.name is set', () => {
        const result = buildDetails(
          baseListing({
            reservedCommunityTypes: { name: 'veteran' },
          } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.community);
        expect(row).toBeDefined();
        expect(row.value).toBe('Veteran');
      });

      it('omits community row when reservedCommunityTypes.name is missing', () => {
        const result = buildDetails(baseListing());
        expect(findByLabel(result, LABELS.community)).toBeUndefined();
      });

      it('includes applications due row when applicationDueDate is set', () => {
        const result = buildDetails(
          baseListing({
            applicationDueDate: new Date(1779228000000),
          } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.applicationsDue);
        expect(row).toBeDefined();
        expect(row.value).toBe('May 19, 2026 at 3:00pm PDT');
      });

      it('omits applications due row when applicationDueDate is absent', () => {
        const result = buildDetails(baseListing());
        expect(findByLabel(result, LABELS.applicationsDue)).toBeUndefined();
      });

      it('includes region row when regions is truthy', () => {
        const result = buildDetails(
          baseListing({ region: RegionEnum.Eastside } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.region);
        expect(row).toBeDefined();
        expect(row.value).toBe(RegionEnum.Eastside);
      });

      it('includes region row when configurableRegion is truthy', () => {
        const result = buildDetails(
          baseListing({
            configurableRegion: 'Test Region',
          } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.region);
        expect(row).toBeDefined();
        expect(row.value).toBe('Test Region');
      });

      it('includes neighborhood row when neighborhood is truthy', () => {
        const result = buildDetails(
          baseListing({ neighborhood: 'Downtown' } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.neighborhood);
        expect(row).toBeDefined();
        expect(row.value).toBe('Downtown');
      });

      it.each([undefined, ''])(
        'omits neighborhood row when neighborhood is falsy (%s)',
        (neighborhood) => {
          const result = buildDetails(
            baseListing({ neighborhood } as Partial<Listing>),
          );
          expect(findByLabel(result, LABELS.neighborhood)).toBeUndefined();
        },
      );

      it('includes lottery date row when a publicLottery event exists', () => {
        const result = buildDetails(
          baseListing({
            listingEvents: [
              {
                type: ListingEventsTypeEnum.publicLottery,
                startDate: new Date(2026, 4, 19),
              },
            ],
          } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.lotteryDate);
        expect(row).toBeDefined();
        expect(row.value).toBe('May 19, 2026');
      });

      it('omits lottery date row when no publicLottery events', () => {
        const result = buildDetails(baseListing({ listingEvents: [] }));
        expect(findByLabel(result, LABELS.lotteryDate)).toBeUndefined();
      });
    });

    describe('accessibility / opportunity type', () => {
      it('includes unit type row when priorityTypes is non-empty', () => {
        const result = buildDetails(baseListing(), [
          UnitAccessibilityPriorityTypeEnum.mobility,
          UnitAccessibilityPriorityTypeEnum.hearing,
        ]);
        const row = findByLabel(result, LABELS.unitType);
        expect(row).toBeDefined();
        expect(row.value).toBe('Mobility, Hearing');
      });

      it('omits unit type row when priorityTypes is empty', () => {
        const result = buildDetails(baseListing(), []);
        expect(findByLabel(result, LABELS.unitType)).toBeUndefined();
      });

      it('includes opportunity type for lottery review order', () => {
        const result = buildDetails(
          baseListing({
            reviewOrderType: ReviewOrderTypeEnum.lottery,
          } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.opportunityType);
        expect(row).toBeDefined();
        expect(row.value).toBe('Lottery');
      });

      it('includes opportunity type for waitlist review order', () => {
        const result = buildDetails(
          baseListing({
            reviewOrderType: ReviewOrderTypeEnum.waitlist,
          } as Partial<Listing>),
        );
        const row = findByLabel(result, LABELS.opportunityType);
        expect(row).toBeDefined();
        expect(row.value).toBe('Waitlist');
      });

      it('omits opportunity type for firstComeFirstServe', () => {
        const result = buildDetails(
          baseListing({
            reviewOrderType: ReviewOrderTypeEnum.firstComeFirstServe,
          } as Partial<Listing>),
        );
        expect(findByLabel(result, LABELS.opportunityType)).toBeUndefined();
      });

      it('omits opportunity type for waitlistLottery', () => {
        const result = buildDetails(
          baseListing({
            reviewOrderType: ReviewOrderTypeEnum.waitlistLottery,
          } as Partial<Listing>),
        );
        expect(findByLabel(result, LABELS.opportunityType)).toBeUndefined();
      });
    });

    describe('unit summary rows', () => {
      it('adds one row per unit type key in summary.units', () => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          units: {
            [UnitTypeEnum.oneBdrm]: {
              count: 3,
              baths: undefined,
              sqft: undefined,
            },
          },
        });
        const row = findByLabel(result, LABELS.oneBdrm);
        expect(row).toBeDefined();
        expect(row.value).toContain('3 units');
      });

      it('sorts unit rows by unitTypeMapping order', () => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          units: {
            [UnitTypeEnum.threeBdrm]: {
              count: 2,
              baths: undefined,
              sqft: undefined,
            },
            [UnitTypeEnum.studio]: {
              count: 5,
              baths: undefined,
              sqft: undefined,
            },
            [UnitTypeEnum.twoBdrm]: {
              count: 3,
              baths: undefined,
              sqft: undefined,
            },
          },
        });
        const unitLabels = result
          .filter((r) =>
            [LABELS.studio, LABELS.twoBdrm, LABELS.threeBdrm].includes(r.label),
          )
          .map((r) => r.label);
        expect(unitLabels).toEqual([
          LABELS.studio,
          LABELS.twoBdrm,
          LABELS.threeBdrm,
        ]);
      });

      it('formats unit summary with count only', () => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          units: {
            [UnitTypeEnum.studio]: {
              count: 2,
              baths: undefined,
              sqft: undefined,
            },
          },
        });
        const row = findByLabel(result, LABELS.studio);
        expect(row.value).toBe('2 units');
      });

      it('formats unit summary with single bath count', () => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          units: {
            [UnitTypeEnum.oneBdrm]: {
              count: 1,
              baths: { min: 1, max: 1 },
              sqft: undefined,
            },
          },
        });
        const row = findByLabel(result, LABELS.oneBdrm);
        expect(row.value).toContain('1 bath');
      });

      it('formats unit summary with bath min-max using max in pluralization', () => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          units: {
            [UnitTypeEnum.oneBdrm]: {
              count: 1,
              baths: { min: 1, max: 2 },
              sqft: undefined,
            },
          },
        });
        const row = findByLabel(result, LABELS.oneBdrm);
        expect(row.value).toMatch(/1 - 2 baths/);
      });

      it.each([
        {
          sqft: { min: 600, max: 600 },
          expected: '600 sqft',
          type: 'single',
        },
        {
          sqft: { min: 500, max: 650 },
          expected: '500 - 650 sqft',
          type: 'range',
        },
      ])('formats unit summary with sqft as $type', ({ sqft, expected }) => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          units: {
            [UnitTypeEnum.studio]: {
              count: 1,
              baths: undefined,
              sqft,
            },
          },
        });
        const row = findByLabel(result, LABELS.studio);
        expect(row.value).toContain(expected);
      });
    });

    describe('rent formatting', () => {
      it('formats mixed flat and percentage rent', () => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          flatRent: { min: 1500, max: 2000 },
          percentageRent: { min: 25, max: 30 },
        });
        const row = findByLabel(result, LABELS.rent);
        expect(row.value).toMatch(/% of income, or up to \$2000/);
      });

      it.each([
        {
          flatRent: { min: 1500, max: 1500 },
          expected: '$1500 per month',
          type: 'single',
        },
        {
          flatRent: { min: 1500, max: 2000 },
          expected: '$1500 - $2000 per month',
          type: 'range',
        },
      ])('formats flat rent as $type', ({ flatRent, expected }) => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          flatRent,
        });
        const row = findByLabel(result, LABELS.rent);
        expect(row.value).toBe(expected);
      });

      it.each([
        {
          percentageRent: { min: 30, max: 30 },
          expected: '30% of income',
          type: 'single',
        },
        {
          percentageRent: { min: 25, max: 30 },
          expected: '25% - 30% of income',
          type: 'range',
        },
      ])('formats percentage rent as $type', ({ percentageRent, expected }) => {
        const result = buildDetails(baseListing(), [], {
          ...emptySummary(),
          percentageRent,
        });
        const row = findByLabel(result, LABELS.rent);
        expect(row.value).toBe(expected);
      });

      it('omits rent row when neither flatRent nor percentageRent is set', () => {
        const result = buildDetails(baseListing(), [], emptySummary());
        expect(findByLabel(result, LABELS.rent)).toBeUndefined();
      });
    });

    describe('income formatting', () => {
      it.each([
        {
          minIncome: { min: 3000, max: 3000 },
          type: 'single',
          expected: '$3000 per month',
        },
        {
          minIncome: { min: 4000, max: 6000 },
          type: 'range',
          expected: '$4000 - $6000 per month',
        },
      ])(
        'includes and formats min income as $type',
        ({ minIncome, expected }) => {
          const result = buildDetails(baseListing(), [], {
            ...emptySummary(),
            minIncome,
          });
          const row = findByLabel(result, LABELS.minIncome);
          expect(row).toBeDefined();
          expect(row.value).toBe(expected);
        },
      );

      it.each([
        {
          maxIncome: { min: 3000, max: 3000 },
          type: 'single',
          expected: '$3000 per month',
        },
        {
          maxIncome: { min: 4000, max: 6000 },
          type: 'range',
          expected: '$4000 - $6000 per month',
        },
      ])(
        'includes and formats max income as $type',
        ({ maxIncome, expected }) => {
          const result = buildDetails(baseListing(), [], {
            ...emptySummary(),
            maxIncome,
          });
          const row = findByLabel(result, LABELS.maxIncome);
          expect(row).toBeDefined();
          expect(row.value).toBe(expected);
        },
      );

      it('omits min income when undefined', () => {
        const result = buildDetails(baseListing(), [], emptySummary());
        expect(findByLabel(result, LABELS.minIncome)).toBeUndefined();
      });

      it('omits max income when undefined', () => {
        const result = buildDetails(baseListing(), [], emptySummary());
        expect(findByLabel(result, LABELS.maxIncome)).toBeUndefined();
      });
    });

    describe('full assembly / order', () => {
      it('builds all sections when every input is populated', () => {
        const result = buildDetails(
          baseListing({
            reservedCommunityTypes: { name: 'veteran' },
            applicationDueDate: new Date(2026, 5, 19),
            neighborhood: 'Downtown',
            reviewOrderType: ReviewOrderTypeEnum.lottery,
            listingEvents: [
              {
                type: ListingEventsTypeEnum.publicLottery,
                startDate: new Date(2026, 5, 25),
              },
            ],
          } as Partial<Listing>),
          [
            UnitAccessibilityPriorityTypeEnum.mobility,
            UnitAccessibilityPriorityTypeEnum.hearing,
          ],
          {
            units: {
              [UnitTypeEnum.studio]: {
                count: 2,
                baths: undefined,
                sqft: undefined,
              },
              [UnitTypeEnum.oneBdrm]: {
                count: 3,
                baths: undefined,
                sqft: undefined,
              },
            },
            flatRent: { min: 1500, max: 2000 },
            percentageRent: { min: 25, max: 30 },
            minIncome: { min: 3000, max: 3000 },
            maxIncome: { min: 4000, max: 6000 },
          },
        );
        expect(result).toHaveLength(12);
        expect(result[0].label).toBe(LABELS.community);
        expect(result[1].label).toBe(LABELS.applicationsDue);
        expect(result[2].label).toBe(LABELS.address);
        expect(result[result.length - 1].label).toBe(LABELS.lotteryDate);
      });

      it('preserves section order for a representative mixed fixture', () => {
        const result = buildDetails(
          baseListing({
            reservedCommunityTypes: { name: 'veteran' },
            applicationDueDate: new Date(2026, 5, 19),
          } as Partial<Listing>),
          [],
          {
            units: {
              [UnitTypeEnum.studio]: {
                count: 2,
                baths: undefined,
                sqft: undefined,
              },
            },
            flatRent: { min: 1500, max: 1500 },
            percentageRent: undefined,
            minIncome: undefined,
            maxIncome: undefined,
          },
        );
        expect(result.map((r) => r.label)).toEqual([
          LABELS.community,
          LABELS.applicationsDue,
          LABELS.address,
          LABELS.studio,
          LABELS.rent,
        ]);
      });
    });

    describe('coming soon variant', () => {
      it('shows applications open row with the scheduled open date instead of applications due', () => {
        const result = buildDetails(
          baseListing({
            applicationDueDate: new Date(2026, 4, 19),
            scheduledApplicationOpenAt: new Date(2026, 6, 1),
          } as Partial<Listing>),
          [],
          emptySummary(),
          'comingSoon',
        );
        const row = findByLabel(result, LABELS.applicationsOpen);
        expect(row).toBeDefined();
        expect(row.value).toBe('July 01, 2026');
        expect(findByLabel(result, LABELS.applicationsDue)).toBeUndefined();
      });

      it('keeps the open date row in the due date row position', () => {
        const result = buildDetails(
          baseListing({
            reservedCommunityTypes: { name: 'veteran' },
            applicationDueDate: new Date(2026, 4, 19),
            scheduledApplicationOpenAt: new Date(2026, 6, 1),
          } as Partial<Listing>),
          [],
          emptySummary(),
          'comingSoon',
        );
        expect(result.map((r) => r.label)).toEqual([
          LABELS.community,
          LABELS.applicationsOpen,
          LABELS.address,
        ]);
      });

      it('falls back to the applications due row when the open date is missing', () => {
        const result = buildDetails(
          baseListing({
            applicationDueDate: new Date(2026, 4, 19),
          } as Partial<Listing>),
          [],
          emptySummary(),
          'comingSoon',
        );
        expect(findByLabel(result, LABELS.applicationsDue)).toBeDefined();
        expect(findByLabel(result, LABELS.applicationsOpen)).toBeUndefined();
      });

      it('standard variant ignores the scheduled open date', () => {
        const result = buildDetails(
          baseListing({
            applicationDueDate: new Date(2026, 4, 19),
            scheduledApplicationOpenAt: new Date(2026, 6, 1),
          } as Partial<Listing>),
        );
        expect(findByLabel(result, LABELS.applicationsDue)).toBeDefined();
        expect(findByLabel(result, LABELS.applicationsOpen)).toBeUndefined();
      });
    });
  });

  describe('listing publish notification', () => {
    const notificationListing = {
      id: 'listingId',
      name: 'Test Listing',
      urlSlug: 'test_listing',
      units: [],
      listingEvents: [],
      listingsBuildingAddress: yellowstoneAddress,
      applicationDueDate: new Date(2026, 4, 19),
      scheduledApplicationOpenAt: new Date(2026, 6, 1),
    } as unknown as Listing;

    let jurisdictionSpy: jest.SpyInstance;

    beforeEach(() => {
      jurisdictionSpy = jest
        .spyOn(jurisdictionServiceMock, 'findOne')
        .mockReturnValue({
          id: 'jurisdictionId',
          name: 'Jurisdiction 1',
          publicUrl: 'https://example.com',
          emailFromAddress: 'no-reply@example.com',
          languages: [LanguagesEnum.en],
        } as unknown as ReturnType<typeof jurisdictionServiceMock.findOne>);
    });

    afterEach(() => {
      jurisdictionSpy.mockRestore();
    });

    it('sends the standard email by default', async () => {
      await service.listingPublishNotification(
        { id: 'jurisdictionId' },
        notificationListing,
        [],
        { en: ['user@example.com'] },
      );
      expect(sendMock).toHaveBeenCalled();
      expect(sendMock.mock.calls[0][0].subject).toEqual(
        'New rental opportunity at Test Listing',
      );
      expect(sendMock.mock.calls[0][0].body).toContain('Rental opportunity at');
      expect(sendMock.mock.calls[0][0].body).toContain('Applications Due');
      expect(sendMock.mock.calls[0][0].body).not.toContain('Applications Open');
    });

    it('sends the coming soon email for the comingSoon variant', async () => {
      await service.listingPublishNotification(
        { id: 'jurisdictionId' },
        notificationListing,
        [],
        { en: ['user@example.com'] },
        'comingSoon',
      );
      expect(sendMock).toHaveBeenCalled();
      expect(sendMock.mock.calls[0][0].subject).toEqual(
        'Coming soon - Test Listing',
      );
      expect(sendMock.mock.calls[0][0].body).toContain('Coming soon');
      expect(sendMock.mock.calls[0][0].body).toContain('Applications Open');
      expect(sendMock.mock.calls[0][0].body).toContain('July 01, 2026');
      expect(sendMock.mock.calls[0][0].body).not.toContain('Applications Due');
    });
  });

  describe('listing publish notification via govDelivery', () => {
    const notificationListing = {
      id: 'listingId',
      name: 'Test Listing',
      urlSlug: 'test_listing',
      units: [],
      listingEvents: [],
      listingsBuildingAddress: yellowstoneAddress,
      applicationDueDate: new Date(2026, 4, 19),
    } as unknown as Listing;

    let jurisdictionSpy: jest.SpyInstance;

    beforeEach(() => {
      jurisdictionSpy = jest
        .spyOn(jurisdictionServiceMock, 'findOne')
        .mockReturnValue({
          id: 'jurisdictionId',
          name: 'Jurisdiction 1',
          publicUrl: 'https://example.com',
          emailFromAddress: 'no-reply@example.com',
          languages: [LanguagesEnum.en],
        } as unknown as ReturnType<typeof jurisdictionServiceMock.findOne>);
    });

    afterEach(() => {
      jurisdictionSpy.mockRestore();
    });

    it('calls govDeliveryService.send with the correct subject and body for the standard variant', async () => {
      await service.listingPublishNotificationViaGovDelivery(
        { id: 'jurisdictionId' },
        notificationListing,
        [],
      );
      expect(govDeliverySendMock).toHaveBeenCalledTimes(1);
      expect(govDeliverySendMock.mock.calls[0][0].subject).toEqual(
        'New rental opportunity at Test Listing',
      );
      expect(govDeliverySendMock.mock.calls[0][0].body).toContain(
        'Rental opportunity at',
      );
      expect(govDeliverySendMock.mock.calls[0][0].body).toContain(
        'Applications Due',
      );
      expect(govDeliverySendMock.mock.calls[0][0].body).not.toContain(
        'Applications Open',
      );
    });
  });
});
