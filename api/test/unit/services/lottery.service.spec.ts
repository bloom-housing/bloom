import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { HttpModule } from '@nestjs/axios';
import { Request as ExpressRequest, Response } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { ApplicationExporterService } from '../../../src/services/application-exporter.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import { User } from '../../../src/dtos/users/user.dto';
import { mockApplicationSet } from './application.service.spec';
import { mockMultiselectQuestion } from './multiselect-question.service.spec';
import { ListingService } from '../../../src/services/listing.service';
import { PermissionService } from '../../../src/services/permission.service';
import { TranslationService } from '../../../src/services/translation.service';
import { ApplicationFlaggedSetService } from '../../../src/services/application-flagged-set.service';
import { EmailService } from '../../../src/services/email.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { Application } from '../../../src/dtos/applications/application.dto';
import MultiselectQuestion from '../../../src/dtos/multiselect-questions/multiselect-question.dto';
import { OrderByEnum } from '../../../src/enums/shared/order-by-enum';
import { LotteryService } from '../../../src/services/lottery.service';
import { ListingLotteryStatus } from '../../../src/dtos/listings/listing-lottery-status.dto';
import { permissionActions } from '../../../src/enums/permissions/permission-actions-enum';

const canOrThrowMock = jest.fn();
const lotteryReleasedMock = jest.fn();
const lotteryPublishedAdminMock = jest.fn();
const lotteryPublishedApplicantMock = jest.fn();

const user = new User();
user.firstName = 'Test';
user.lastName = 'User';
user.email = 'test@example.com';

describe('Testing lottery service', () => {
  let service: LotteryService;
  let prisma: PrismaService;
  let listingService: ListingService;
  let config: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationExporterService,
        PrismaService,
        MultiselectQuestionService,
        ListingService,
        LotteryService,
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: canOrThrowMock,
          },
        },
        TranslationService,
        ApplicationFlaggedSetService,
        {
          provide: EmailService,
          useValue: {
            requestApproval: jest.fn(),
            changesRequested: jest.fn(),
            listingApproved: jest.fn(),
            lotteryReleased: lotteryReleasedMock,
            lotteryPublishedAdmin: lotteryPublishedAdminMock,
            lotteryPublishedApplicant: lotteryPublishedApplicantMock,
          },
        },

        ConfigService,
        Logger,
        SchedulerRegistry,
        GoogleTranslateService,
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<LotteryService>(LotteryService);
    prisma = module.get<PrismaService>(PrismaService);
    listingService = module.get<ListingService>(ListingService);
    config = module.get<ConfigService>(ConfigService);

    jest.spyOn(listingService, 'getUserEmailInfo').mockResolvedValueOnce({
      emails: ['admin@email.com', 'partner@email.com'],
    });

    jest.spyOn(service, 'getPublicUserEmailInfo').mockResolvedValueOnce({
      en: ['applicant@email.com'],
    });
  });

  describe('Testing lotteryRandomizerHelper()', () => {
    it('should generate random ordinal arrays', () => {
      for (let i = 0; i < 10; i++) {
        // create and fill mock array
        const filteredApplicationArray: Application[] = [];
        for (let j = 0; j < i + 1; j++) {
          filteredApplicationArray.push({
            id: randomUUID(),
          } as unknown as Application);
        }

        // run through randomizer
        const ordinalArray = service.lotteryRandomizerHelper(
          filteredApplicationArray,
        );

        // verify the results are random
        expect(filteredApplicationArray.length).toEqual(ordinalArray.length);

        for (let j = 1; j <= i + 1; j++) {
          expect(ordinalArray.find((val) => val === j)).toEqual(j);
        }
      }
    });

    it('should store randomized ordinals when no preferences on listing', async () => {
      const listingId = randomUUID();
      const applications: Application[] = [];
      for (let i = 0; i < 10; i++) {
        applications.push({
          id: randomUUID(),
          markedAsDuplicate: false,
        } as unknown as Application);
      }

      prisma.applicationLotteryPositions.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.applicationLotteryTotal.create = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      await service.lotteryRandomizer(listingId, applications, []);

      expect(
        prisma.applicationLotteryPositions.createMany,
      ).toHaveBeenCalledTimes(1);
      expect(prisma.applicationLotteryTotal.create).toHaveBeenCalledTimes(1);

      const args = (prisma.applicationLotteryPositions.createMany as any).mock
        .calls[0][0].data;

      for (let i = 1; i < 11; i++) {
        expect(args.find((val) => val.ordinal === i)).toEqual({
          listingId,
          applicationId: expect.anything(),
          ordinal: i,
          multiselectQuestionId: null,
        });
      }
    });
  });

  describe('Testing lotteryRandomizer()', () => {
    it('should store randomized ordinals when every application has a preference', async () => {
      const listingId = randomUUID();
      const applications: Application[] = [];
      const preferences: MultiselectQuestion[] = [
        {
          id: randomUUID(),
          text: 'example text',
        } as unknown as MultiselectQuestion,
      ];
      for (let i = 0; i < 10; i++) {
        applications.push({
          id: randomUUID(),
          markedAsDuplicate: false,
          preferences: [
            {
              key: 'example text',
              claimed: false,
            },
          ],
        } as unknown as Application);
      }

      prisma.applicationLotteryPositions.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.applicationLotteryTotal.create = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      await service.lotteryRandomizer(listingId, applications, preferences);

      const args = (prisma.applicationLotteryPositions.createMany as any).mock
        .calls[0][0].data;

      for (let i = 1; i < 11; i++) {
        expect(args.find((val) => val.ordinal === i)).toEqual({
          listingId,
          applicationId: expect.anything(),
          ordinal: i,
          multiselectQuestionId: null,
        });
      }

      expect(prisma.applicationLotteryPositions.createMany).toBeCalledTimes(1);
      expect(prisma.applicationLotteryTotal.create).toBeCalledTimes(1);
    });

    it('should store randomized ordinals and preference specific ordinals', async () => {
      const listingId = randomUUID();
      const applications: Application[] = [];
      const preferences: MultiselectQuestion[] = [
        {
          id: randomUUID(),
          text: 'example text',
          options: [],
        } as unknown as MultiselectQuestion,
      ];
      for (let i = 0; i < 10; i++) {
        applications.push({
          id: randomUUID(),
          markedAsDuplicate: false,
          preferences: [
            {
              key: 'example text',
              claimed: i % 2 === 0,
              options: [{ key: 'example option', checked: i % 2 === 0 }],
            },
          ],
        } as unknown as Application);
      }

      prisma.applicationLotteryPositions.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.applicationLotteryTotal.create = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      await service.lotteryRandomizer(listingId, applications, preferences);

      const args = (prisma.applicationLotteryPositions.createMany as any).mock
        .calls[0][0].data;

      for (let i = 1; i < 11; i++) {
        expect(args.find((val) => val.ordinal === i)).toEqual({
          listingId,
          applicationId: expect.anything(),
          ordinal: i,
          multiselectQuestionId: null,
        });
      }

      const argsWithPreference = (
        prisma.applicationLotteryPositions.createMany as any
      ).mock.calls[1][0].data;

      for (let i = 1; i < 5; i++) {
        expect(argsWithPreference.find((val) => val.ordinal === i)).toEqual({
          listingId,
          applicationId: expect.anything(),
          ordinal: i,
          multiselectQuestionId: expect.anything(),
        });
      }

      expect(argsWithPreference.find((val) => val.ordinal === 6)).toEqual(
        undefined,
      );

      expect(prisma.applicationLotteryPositions.createMany).toBeCalledTimes(2);
      expect(prisma.applicationLotteryTotal.create).toBeCalledTimes(2);
    });

    it('should not store preference ordinal if opted out', async () => {
      const listingId = randomUUID();
      const applications: Application[] = [];
      const preferences: MultiselectQuestion[] = [
        {
          id: randomUUID(),
          text: 'example text',
          optOutText: 'opt out text',
          options: [{ key: 'example option' }],
        } as unknown as MultiselectQuestion,
      ];
      applications.push({
        id: randomUUID(),
        markedAsDuplicate: false,
        preferences: [
          {
            key: 'example text',
            claimed: true,
            options: [
              {
                key: 'example option',
                checked: false,
              },
              {
                key: 'opt out text',
                checked: true,
              },
            ],
          },
        ],
      } as unknown as Application);

      prisma.applicationLotteryPositions.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.applicationLotteryTotal.create = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      await service.lotteryRandomizer(listingId, applications, preferences);

      const args = (prisma.applicationLotteryPositions.createMany as any).mock
        .calls[0][0].data;

      expect(args[0]).toEqual({
        listingId,
        applicationId: expect.anything(),
        ordinal: 1,
        multiselectQuestionId: null,
      });

      const argsWithPreference = (
        prisma.applicationLotteryPositions.createMany as any
      ).mock.calls[1];

      expect(argsWithPreference).toBeUndefined();

      expect(prisma.applicationLotteryPositions.createMany).toBeCalledTimes(1);
      expect(prisma.applicationLotteryTotal.create).toBeCalledTimes(1);
    });
  });

  describe('Testing lotteryGenerate()', () => {
    it('should error if not an admin', async () => {
      const listingId = randomUUID();
      const requestingUser = {
        firstName: 'requesting fName',
        lastName: 'requesting lName',
        email: 'requestingUser@email.com',
        jurisdictions: [{ id: 'juris id' }],
        userRoles: { isAdmin: false },
      } as unknown as User;

      prisma.listings.findUnique = jest.fn();

      await expect(
        async () =>
          await service.lotteryGenerate(
            { user: requestingUser } as unknown as ExpressRequest,
            {} as unknown as Response,
            { id: listingId },
          ),
      ).rejects.toThrowError();

      expect(prisma.listings.findUnique).not.toHaveBeenCalled();
    });

    it('should build lottery when no prior lottery has been ran', async () => {
      const listingId = randomUUID();
      const requestingUser = {
        firstName: 'requesting fName',
        lastName: 'requesting lName',
        email: 'requestingUser@email.com',
        jurisdictions: [{ id: 'juris id' }],
        userRoles: { isAdmin: true },
      } as unknown as User;

      canOrThrowMock.mockResolvedValue(true);
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: listingId,
        lotteryLastRunAt: null,
        lotteryStatus: null,
        status: ListingsStatusEnum.closed,
      });
      const applications = mockApplicationSet(5, new Date());
      prisma.applications.findMany = jest.fn().mockReturnValue(applications);

      prisma.multiselectQuestions.findMany = jest.fn().mockReturnValue([
        {
          ...mockMultiselectQuestion(
            0,
            new Date(),
            MultiselectQuestionsApplicationSectionEnum.preferences,
          ),
          options: [
            { id: 1, text: 'text' },
            { id: 2, text: 'text', collectAddress: true },
          ],
        },
        {
          ...mockMultiselectQuestion(
            1,
            new Date(),
            MultiselectQuestionsApplicationSectionEnum.programs,
          ),
          options: [{ id: 1, text: 'text' }],
        },
      ]);

      prisma.applicationLotteryPositions.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.applicationLotteryTotal.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.listings.update = jest.fn().mockResolvedValue({
        id: listingId,
        lotteryLastRunAt: null,
        lotteryStatus: null,
      });
      prisma.userAccounts.findMany = jest.fn().mockResolvedValue([]);

      await service.lotteryGenerate(
        { user: requestingUser } as unknown as ExpressRequest,
        {} as unknown as Response,
        { id: listingId },
      );

      expect(prisma.listings.findUnique).toHaveBeenCalledWith({
        select: {
          id: true,
          lotteryStatus: true,
        },
        where: {
          id: listingId,
        },
      });

      expect(prisma.applications.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          preferences: true,
          householdMember: {
            select: {
              id: true,
            },
          },
          applicationLotteryPositions: {
            select: {
              ordinal: true,
              multiselectQuestionId: true,
            },
            where: {
              multiselectQuestionId: null,
            },
            orderBy: {
              ordinal: OrderByEnum.DESC,
            },
          },
        },
        where: {
          listingId: listingId,
          deletedAt: null,
          markedAsDuplicate: false,
        },
      });

      expect(prisma.applicationLotteryPositions.createMany).toHaveBeenCalled();
      expect(prisma.applicationLotteryTotal.create).toHaveBeenCalled();

      expect(prisma.listings.update).toHaveBeenCalledWith({
        data: {
          lotteryLastRunAt: expect.anything(),
          lotteryStatus: LotteryStatusEnum.ran,
        },
        where: {
          id: listingId,
        },
      });
    });

    it('should generate lottery results when previous results exist', async () => {
      const listingId = randomUUID();
      const requestingUser = {
        firstName: 'requesting fName',
        lastName: 'requesting lName',
        email: 'requestingUser@email.com',
        jurisdictions: [{ id: 'juris id' }],
        userRoles: { isAdmin: true },
      } as unknown as User;

      canOrThrowMock.mockResolvedValue(true);
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: listingId,
        lotteryLastRunAt: new Date(),
        lotteryStatus: LotteryStatusEnum.ran,
        status: ListingsStatusEnum.closed,
      });
      const applications = mockApplicationSet(5, new Date());
      prisma.applications.findMany = jest.fn().mockReturnValue(applications);

      prisma.multiselectQuestions.findMany = jest.fn().mockReturnValue([
        {
          ...mockMultiselectQuestion(
            0,
            new Date(),
            MultiselectQuestionsApplicationSectionEnum.preferences,
          ),
          options: [
            { id: 1, text: 'text' },
            { id: 2, text: 'text', collectAddress: true },
          ],
        },
        {
          ...mockMultiselectQuestion(
            1,
            new Date(),
            MultiselectQuestionsApplicationSectionEnum.programs,
          ),
          options: [{ id: 1, text: 'text' }],
        },
      ]);

      prisma.applicationLotteryPositions.deleteMany = jest.fn();
      prisma.applicationLotteryPositions.createMany = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.applicationLotteryTotal.deleteMany = jest.fn();
      prisma.applicationLotteryTotal.create = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });

      prisma.listings.update = jest.fn().mockResolvedValue({
        id: listingId,
        lotteryLastRunAt: null,
        lotteryStatus: null,
      });
      prisma.userAccounts.findMany = jest.fn().mockResolvedValue([]);

      await service.lotteryGenerate(
        { user: requestingUser } as unknown as ExpressRequest,
        {} as unknown as Response,
        { id: listingId },
      );

      expect(prisma.listings.findUnique).toHaveBeenCalledWith({
        select: {
          id: true,
          lotteryStatus: true,
        },
        where: {
          id: listingId,
        },
      });

      expect(
        prisma.applicationLotteryPositions.deleteMany,
      ).toHaveBeenCalledWith({ where: { listingId: listingId } });
      expect(prisma.applicationLotteryTotal.deleteMany).toHaveBeenCalledWith({
        where: { listingId: listingId },
      });
      expect(prisma.applications.findMany).toHaveBeenCalled();

      expect(prisma.applicationLotteryPositions.createMany).toHaveBeenCalled();
      expect(prisma.applicationLotteryTotal.create).toHaveBeenCalled();

      expect(prisma.listings.update).toHaveBeenCalled();
    });
  });

  describe('Testing lotteryStatus()', () => {
    const adminUser = {
      id: 'admin id',
      userRoles: {
        isAdmin: true,
      },
    } as User;

    const partnerUser = {
      id: 'partner id',
      userRoles: {
        isAdmin: false,
        isPartner: true,
      },
    } as User;

    const publicUser = {
      id: 'partner id',
      userRoles: {
        isAdmin: false,
        isPartner: false,
      },
    } as User;

    it('should error when listing is not closed', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.active,
      });
      prisma.listings.update = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.lotteryStatus(
            {
              id: randomUUID(),
              lotteryStatus: LotteryStatusEnum.ran,
            } as ListingLotteryStatus,
            user,
          ),
      ).rejects.toThrowError(
        'Lottery status cannot be changed until listing is closed.',
      );

      expect(canOrThrowMock).toHaveBeenCalledWith(
        user,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );

      expect(prisma.listings.update).not.toHaveBeenCalled();
    });

    it.todo(
      'should not update status if requested status does not match enums',
    );

    it.todo('should update status to ran from null/errored');

    it('should not update status to ran if user is not an admin', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
      });
      prisma.listings.update = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.lotteryStatus(
            {
              id: randomUUID(),
              lotteryStatus: LotteryStatusEnum.ran,
            } as ListingLotteryStatus,
            partnerUser,
          ),
      ).rejects.toThrowError();

      expect(canOrThrowMock).toHaveBeenCalledWith(
        partnerUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );

      expect(prisma.listings.update).not.toHaveBeenCalled();
    });

    it.todo('should update status to errored');

    it('should update status to releasedToPartners from ran and send email', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.ran,
        jurisdictionId: 'jurisId',
      });
      prisma.listings.update = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
        jurisdictionId: 'jurisId',
      });

      jest.spyOn(listingService, 'getUserEmailInfo').mockResolvedValueOnce({
        emails: ['admin@email.com', 'partner@email.com'],
      });

      jest.spyOn(service, 'getPublicUserEmailInfo').mockResolvedValueOnce({
        en: ['applicant@email.com'],
      });

      await service.lotteryStatus(
        {
          id: randomUUID(),
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
        } as ListingLotteryStatus,
        adminUser,
      );

      expect(canOrThrowMock).toHaveBeenCalledWith(
        adminUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
          jurisdictionId: 'jurisId',
        },
      );
      expect(prisma.listings.update).toHaveBeenCalledWith({
        data: {
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
        },
        where: {
          id: expect.anything(),
        },
      });

      expect(listingService.getUserEmailInfo).toBeCalledWith(
        ['admin', 'jurisdictionAdmin', 'partner'],
        'example id',
        'jurisId',
      );

      expect(lotteryReleasedMock).toBeCalledWith(
        { id: 'example id', juris: 'jurisId', name: 'example name' },
        ['admin@email.com', 'partner@email.com'],
        config.get('PARTNERS_PORTAL_URL'),
      );
    });

    it('should not update status to releasedToPartners if user is not an admin', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.ran,
      });
      prisma.listings.update = jest.fn().mockResolvedValue(null);
      jest.spyOn(listingService, 'getUserEmailInfo').mockResolvedValueOnce({
        emails: ['admin@email.com', 'partner@email.com'],
      });
      jest.spyOn(service, 'getPublicUserEmailInfo').mockResolvedValueOnce({
        en: ['applicant@email.com'],
      });

      await expect(
        async () =>
          await service.lotteryStatus(
            {
              id: randomUUID(),
              lotteryStatus: LotteryStatusEnum.releasedToPartners,
            } as ListingLotteryStatus,
            partnerUser,
          ),
      ).rejects.toThrowError();

      expect(canOrThrowMock).toHaveBeenCalledWith(
        partnerUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );

      expect(prisma.listings.update).not.toHaveBeenCalled();
    });

    it('should update status to publishedToPublic from releasedToPartners', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
      });
      prisma.listings.update = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.publishedToPublic,
      });
      jest.spyOn(listingService, 'getUserEmailInfo').mockResolvedValueOnce({
        emails: ['admin@email.com', 'partner@email.com'],
      });
      jest.spyOn(service, 'getPublicUserEmailInfo').mockResolvedValueOnce({
        en: ['applicant@email.com'],
      });

      await service.lotteryStatus(
        {
          id: randomUUID(),
          lotteryStatus: LotteryStatusEnum.publishedToPublic,
        } as ListingLotteryStatus,
        partnerUser,
      );

      expect(canOrThrowMock).toHaveBeenCalledWith(
        partnerUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );
      expect(prisma.listings.update).toHaveBeenCalledWith({
        data: {
          lotteryStatus: LotteryStatusEnum.publishedToPublic,
          lotteryLastPublishedAt: expect.anything(),
        },
        where: {
          id: expect.anything(),
        },
      });
    });

    it('should not update status to publishedToPublic when status is not releasedToPartners', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.ran,
      });
      prisma.listings.update = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.lotteryStatus(
            {
              id: randomUUID(),
              lotteryStatus: LotteryStatusEnum.publishedToPublic,
            } as ListingLotteryStatus,
            partnerUser,
          ),
      ).rejects.toThrowError();

      expect(canOrThrowMock).toHaveBeenCalledWith(
        partnerUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );

      expect(prisma.listings.update).not.toHaveBeenCalled();
    });

    it('should not update status to publishedToPublic if user is not an admin or partner', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
      });
      prisma.listings.update = jest.fn().mockResolvedValue(null);

      await expect(
        async () =>
          await service.lotteryStatus(
            {
              id: randomUUID(),
              lotteryStatus: LotteryStatusEnum.publishedToPublic,
            } as ListingLotteryStatus,
            publicUser,
          ),
      ).rejects.toThrowError();

      expect(canOrThrowMock).toHaveBeenCalledWith(
        publicUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );

      expect(prisma.listings.update).not.toHaveBeenCalled();
    });

    it('should update status to ran from approved/releasedToPartners/publishedToPublic aka retracted', async () => {
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
      });
      prisma.listings.update = jest.fn().mockResolvedValue({
        id: 'example id',
        name: 'example name',
        status: ListingsStatusEnum.closed,
        lotteryStatus: LotteryStatusEnum.ran,
      });
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);
      jest.spyOn(service, 'getPublicUserEmailInfo').mockResolvedValueOnce({
        en: ['applicant@email.com'],
      });

      jest.spyOn(listingService, 'getUserEmailInfo').mockResolvedValueOnce({
        emails: ['admin@email.com', 'partner@email.com'],
      });

      await service.lotteryStatus(
        {
          id: randomUUID(),
          lotteryStatus: LotteryStatusEnum.ran,
        } as ListingLotteryStatus,
        adminUser,
      );

      expect(canOrThrowMock).toHaveBeenCalledWith(
        adminUser,
        'listing',
        permissionActions.update,
        {
          id: 'example id',
        },
      );
      expect(prisma.listings.update).toHaveBeenCalledWith({
        data: {
          lotteryLastRunAt: expect.anything(),
          lotteryStatus: LotteryStatusEnum.ran,
        },
        where: {
          id: expect.anything(),
        },
      });
    });
  });

  describe('Test autoPublishResults endpoint', () => {
    it('should call the update', async () => {
      prisma.listings.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example id1',
          listingEvents: [
            {
              type: ListingEventsTypeEnum.publicLottery,
            },
          ],
        },
      ]);
      prisma.activityLog.create = jest.fn().mockResolvedValue({});
      prisma.cronJob.findFirst = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });
      prisma.cronJob.update = jest.fn().mockResolvedValue(true);

      await service.autoPublishResults();
      expect(prisma.listings.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          jurisdictions: true,
        },
        where: {
          status: ListingsStatusEnum.closed,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          lotteryOptIn: true,
          lotteryStatus: LotteryStatusEnum.releasedToPartners,
          listingEvents: {
            some: {
              type: ListingEventsTypeEnum.publicLottery,
              startDate: { lt: expect.anything() },
            },
          },
        },
      });
      expect(prisma.listings.update).toHaveBeenCalledWith({
        data: {
          lotteryStatus: LotteryStatusEnum.publishedToPublic,
          lotteryLastPublishedAt: expect.anything(),
        },
        where: {
          id: 'example id1',
        },
      });
      expect(prisma.activityLog.create).toHaveBeenCalledWith({
        data: {
          module: 'lottery',
          recordId: 'example id1',
          action: 'update',
          metadata: { lotteryStatus: LotteryStatusEnum.publishedToPublic },
        },
      });
      expect(prisma.cronJob.findFirst).toHaveBeenCalled();
      expect(prisma.cronJob.update).toHaveBeenCalled();
    });
  });

  describe('Test expireLotteries endpoint', () => {
    it('should call the updateMany', async () => {
      prisma.listings.findMany = jest.fn().mockResolvedValue([
        {
          id: 'example id1',
        },
        {
          id: 'example id2',
        },
      ]);
      prisma.listings.updateMany = jest.fn().mockResolvedValue({ count: 2 });
      prisma.activityLog.createMany = jest.fn().mockResolvedValue({ count: 2 });
      prisma.cronJob.findFirst = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });
      prisma.cronJob.update = jest.fn().mockResolvedValue(true);

      await service.expireLotteries();
      expect(prisma.listings.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          status: ListingsStatusEnum.closed,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          closedAt: {
            lte: expect.anything(),
          },
          OR: [
            {
              lotteryStatus: {
                not: LotteryStatusEnum.expired,
              },
            },
            {
              lotteryStatus: null,
            },
          ],
        },
      });
      expect(prisma.listings.updateMany).toHaveBeenCalledWith({
        data: {
          lotteryStatus: LotteryStatusEnum.expired,
        },
        where: {
          id: { in: ['example id1', 'example id2'] },
        },
      });
      expect(prisma.activityLog.createMany).toHaveBeenCalledWith({
        data: [
          {
            module: 'lottery',
            recordId: 'example id1',
            action: 'update',
            metadata: { lotteryStatus: LotteryStatusEnum.expired },
          },
          {
            module: 'lottery',
            recordId: 'example id2',
            action: 'update',
            metadata: { lotteryStatus: LotteryStatusEnum.expired },
          },
        ],
      });
      expect(prisma.cronJob.findFirst).toHaveBeenCalled();
      expect(prisma.cronJob.update).toHaveBeenCalled();
    });
  });

  describe('Testing getLotteryStatusFromActivityLogMetadata()', () => {
    it('should format first status correctly', () => {
      expect(
        service.getLotteryStatusFromActivityLogMetadata('ran', 0, null),
      ).toEqual('ran');
    });
    it('should format intermediate statuses correctly', () => {
      expect(
        service.getLotteryStatusFromActivityLogMetadata(
          'releasedToPartners',
          0,
          'ran',
        ),
      ).toEqual('releasedToPartners');
      expect(
        service.getLotteryStatusFromActivityLogMetadata(
          'publishedToPublic',
          0,
          'releasedToPartners',
        ),
      ).toEqual('publishedToPublic');
    });
    it('should format rerun correctly', () => {
      expect(
        service.getLotteryStatusFromActivityLogMetadata('ran', 1, 'ran'),
      ).toEqual('rerun');
    });
    it('should format retracted correctly', () => {
      expect(
        service.getLotteryStatusFromActivityLogMetadata(
          'ran',
          1,
          'releasedToPartners',
        ),
      ).toEqual('retracted');
      expect(
        service.getLotteryStatusFromActivityLogMetadata(
          'ran',
          1,
          'publishedToPublic',
        ),
      ).toEqual('retracted');
    });
  });

  describe('Testing lotteryActivityLog()', () => {
    const listingId = randomUUID();
    const adminUser = {
      id: 'admin id',
      userRoles: {
        isAdmin: true,
      },
    } as User;

    const partnerUser = {
      id: 'partner id',
      userRoles: {
        isAdmin: false,
        isPartner: true,
      },
    } as User;

    const openedDate = new Date();
    openedDate.setDate(openedDate.getDate() - 11);
    const closedDate = new Date();
    closedDate.setDate(closedDate.getDate() - 10);
    const ranDate = new Date();
    ranDate.setDate(ranDate.getDate() - 9);
    const reRanDate = new Date();
    reRanDate.setDate(reRanDate.getDate() - 8);
    const releasedDate = new Date();
    releasedDate.setDate(releasedDate.getDate() - 7);
    const retractedDate = new Date();
    retractedDate.setDate(retractedDate.getDate() - 6);
    const released2Date = new Date();
    released2Date.setDate(released2Date.getDate() - 5);
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - 4);

    beforeEach(() => {
      canOrThrowMock.mockResolvedValue(true);
      prisma.activityLog.findMany = jest.fn().mockResolvedValue([
        {
          metadata: { status: 'active' },
          updatedAt: openedDate,
          userAccounts: {
            firstName: 'Abc',
            lastName: 'Def',
          },
        },
        {
          metadata: { status: 'closed' },
          updatedAt: closedDate,
          userAccounts: {
            firstName: 'Abc',
            lastName: 'Def',
          },
        },
        {
          metadata: { status: 'closed' },
          updatedAt: ranDate,
          userAccounts: {
            firstName: 'Abc',
            lastName: 'Def',
          },
        },
        {
          metadata: { lotteryStatus: 'ran' },
          updatedAt: ranDate,
          userAccounts: {
            firstName: 'Ghi',
            lastName: 'Jkl',
          },
        },
        {
          metadata: { lotteryStatus: 'ran' },
          updatedAt: reRanDate,
          userAccounts: {
            firstName: 'Mno',
            lastName: 'Pqr',
          },
        },
        {
          metadata: { lotteryStatus: 'releasedToPartners' },
          updatedAt: releasedDate,
          userAccounts: {
            firstName: 'Stu',
            lastName: 'Vwx',
          },
        },
        {
          metadata: { lotteryStatus: 'ran' },
          updatedAt: retractedDate,
          userAccounts: {
            firstName: 'Yza',
            lastName: 'Bcd',
          },
        },
        {
          metadata: { lotteryStatus: 'releasedToPartners' },
          updatedAt: released2Date,
          userAccounts: {
            firstName: 'Efg',
            lastName: 'Hij',
          },
        },
        {
          metadata: { lotteryStatus: 'publishedToPublic' },
          updatedAt: publishedDate,
          userAccounts: {
            firstName: 'Klm',
            lastName: 'Nop',
          },
        },
      ]);
    });
    it('should process lottery activity log for an admin', async () => {
      const historyLog = await service.lotteryActivityLog(listingId, adminUser);

      expect(historyLog).toEqual([
        {
          logDate: closedDate,
          name: 'Abc Def',
          status: 'closed',
        },
        {
          logDate: ranDate,
          name: 'Ghi Jkl',
          status: 'ran',
        },
        {
          logDate: reRanDate,
          name: 'Mno Pqr',
          status: 'rerun',
        },
        {
          logDate: releasedDate,
          name: 'Stu Vwx',
          status: 'releasedToPartners',
        },
        {
          logDate: retractedDate,
          name: 'Yza Bcd',
          status: 'retracted',
        },
        {
          logDate: released2Date,
          name: 'Efg Hij',
          status: 'releasedToPartners',
        },
        {
          logDate: publishedDate,
          name: 'Klm Nop',
          status: 'publishedToPublic',
        },
      ]);
    });
    it('should process lottery activity log for a partner', async () => {
      const historyLog = await service.lotteryActivityLog(
        listingId,
        partnerUser,
      );

      expect(historyLog).toEqual([
        {
          logDate: closedDate,
          name: 'Abc Def',
          status: 'closed',
        },
        {
          logDate: releasedDate,
          name: 'Stu Vwx',
          status: 'releasedToPartners',
        },
        {
          logDate: retractedDate,
          name: 'Yza Bcd',
          status: 'retracted',
        },
        {
          logDate: released2Date,
          name: 'Efg Hij',
          status: 'releasedToPartners',
        },
        {
          logDate: publishedDate,
          name: 'Klm Nop',
          status: 'publishedToPublic',
        },
      ]);
    });
  });

  describe('Testing publicLotteryResults()', () => {
    const applicationId = randomUUID();
    const publicUser = {
      id: 'public id',
      userRoles: {},
    } as User;

    it('should query for lottery positions', async () => {
      prisma.applications.findFirst = jest
        .fn()
        .mockResolvedValue({ userId: publicUser.id });
      prisma.applicationLotteryPositions.findMany = jest
        .fn()
        .mockResolvedValue([
          { ordinal: 10, multiselectQuestionId: null },
          { ordinal: 5, multiselectQuestionId: 'preference id' },
        ]);
      await service.publicLotteryResults(applicationId, publicUser);

      expect(prisma.applicationLotteryPositions.findMany).toHaveBeenCalledWith({
        select: {
          ordinal: true,
          multiselectQuestionId: true,
        },
        where: {
          applicationId,
        },
      });
    });
  });

  describe('Testing lotteryTotals()', () => {
    const listingId = randomUUID();
    const publicUser = {
      id: 'public id',
      userRoles: {},
    } as User;

    it('should query for lottery totals', async () => {
      prisma.applications.findFirst = jest
        .fn()
        .mockResolvedValue({ userId: publicUser.id });
      prisma.applicationLotteryTotal.findMany = jest.fn().mockResolvedValue([
        { total: 10, multiselectQuestionId: null, listingId },
        { total: 5, multiselectQuestionId: 'preference id', listingId },
      ]);
      await service.lotteryTotals(listingId, publicUser);

      expect(prisma.applicationLotteryTotal.findMany).toHaveBeenCalledWith({
        select: {
          total: true,
          multiselectQuestionId: true,
        },
        where: {
          listingId,
        },
      });
    });

    it('should fail for no user', async () => {
      prisma.applications.findFirstOrThrow = jest
        .fn()
        .mockResolvedValue({ userId: publicUser.id });
      prisma.applicationLotteryTotal.findMany = jest.fn().mockResolvedValue([
        { total: 10, multiselectQuestionId: null, listingId },
        { total: 5, multiselectQuestionId: 'preference id', listingId },
      ]);

      await expect(
        async () => await service.lotteryTotals(listingId, null),
      ).rejects.toThrowError();
    });
  });
});
