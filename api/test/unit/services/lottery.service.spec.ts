import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import { HttpModule } from '@nestjs/axios';
import { Request as ExpressRequest, Response } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { ApplicationCsvExporterService } from '../../../src/services/application-csv-export.service';
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

describe('Testing lottery service', () => {
  let service: LotteryService;
  let prisma: PrismaService;
  let permissionService: PermissionService;
  let listingService: ListingService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationCsvExporterService,
        PrismaService,
        MultiselectQuestionService,
        ListingService,
        LotteryService,
        PermissionService,
        TranslationService,
        ApplicationFlaggedSetService,
        {
          provide: EmailService,
          useValue: {
            requestApproval: jest.fn(),
            changesRequested: jest.fn(),
            listingApproved: jest.fn(),
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
    permissionService = module.get<PermissionService>(PermissionService);

    jest.spyOn(listingService, 'getUserEmailInfo').mockResolvedValueOnce({
      emails: ['admin@email.com', 'partner@email.com'],
    });

    jest.spyOn(listingService, 'getPublicUserEmailInfo').mockResolvedValueOnce({
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

      await service.lotteryRandomizer(listingId, applications, []);

      expect(prisma.applicationLotteryPositions.createMany).toHaveBeenCalled();

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
    });

    it('should store randomized ordinals and preference specific ordinals', async () => {
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
              claimed: i % 2 === 0,
            },
          ],
        } as unknown as Application);
      }

      prisma.applicationLotteryPositions.createMany = jest
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
    });
  });

  describe('Testing lotteryGenerate()', () => {
    it('should build lottery when no prior lottery has been ran', async () => {
      const listingId = randomUUID();
      const requestingUser = {
        firstName: 'requesting fName',
        lastName: 'requesting lName',
        email: 'requestingUser@email.com',
        jurisdictions: [{ id: 'juris id' }],
        userRoles: { isAdmin: true },
      } as unknown as User;

      permissionService.canOrThrow = jest.fn().mockResolvedValue(true);
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

      prisma.listings.update = jest.fn().mockResolvedValue({
        id: listingId,
        lotteryLastRunAt: null,
        lotteryStatus: null,
      });

      await service.lotteryGenerate(
        { user: requestingUser } as unknown as ExpressRequest,
        {} as unknown as Response,
        { listingId },
      );

      expect(prisma.listings.findUnique).toHaveBeenCalledWith({
        select: {
          id: true,
          lotteryLastRunAt: true,
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
  });
});
