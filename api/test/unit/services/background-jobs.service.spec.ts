import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BackgroundJobStatusEnum } from '@prisma/client';
import { randomUUID } from 'crypto';
import { BackgroundJobsService } from '../../../src/services/background-jobs.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { S3Service } from '../../../src/services/s3.service';
import { PermissionService } from '../../../src/services/permission.service';
import { BackgroundJob } from '../../../src/dtos/background-jobs/background-job.dto';
import { UserRoleEnum } from '../../../src/enums/permissions/user-role-enum';

const listingId = randomUUID();
const jobId = randomUUID();
const userId = randomUUID();

const requestingUser = { id: userId } as any;

const createDto = {
  listingId,
  inputS3Key: 'uploads/test-file.csv',
};

const dbJobRecord = {
  id: jobId,
  listingId,
  requestedByUserId: userId,
  inputS3Key: 'uploads/test-file.csv',
  status: BackgroundJobStatusEnum.processing,
  totalRecords: null,
  errorMessage: null,
  errorRow: null,
  completedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Background Jobs Service Tests', () => {
  let service: BackgroundJobsService;
  let prisma: PrismaService;
  let permissionService: PermissionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackgroundJobsService,
        PrismaService,
        { provide: S3Service, useValue: {} },
        {
          provide: PermissionService,
          useValue: { canOrThrow: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<BackgroundJobsService>(BackgroundJobsService);
    prisma = module.get<PrismaService>(PrismaService);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  describe('create', () => {
    beforeEach(() => {
      permissionService.canOrThrow = jest.fn().mockResolvedValue(undefined);
    });

    it('should create and return a BackgroundJob when no active job exists for the listing', async () => {
      prisma.backgroundJob.findFirst = jest.fn().mockResolvedValue(null);
      prisma.backgroundJob.create = jest.fn().mockResolvedValue(dbJobRecord);

      const result = await service.create(createDto, {
        ...requestingUser,
        userRoles: [UserRoleEnum.user],
      });

      expect(result).toBeInstanceOf(BackgroundJob);
      expect(result.listingId).toBe(listingId);
      expect(result.status).toBe(BackgroundJobStatusEnum.processing);
      expect(prisma.backgroundJob.create).toHaveBeenCalledWith({
        data: {
          listingId,
          requestedByUserId: userId,
          inputS3Key: createDto.inputS3Key,
          status: BackgroundJobStatusEnum.processing,
        },
      });
    });

    it('should throw ForbiddenException when the user lacks permission to create a job', async () => {
      permissionService.canOrThrow = jest
        .fn()
        .mockRejectedValue(new ForbiddenException());
      prisma.backgroundJob.findFirst = jest.fn();

      await expect(service.create(createDto, requestingUser)).rejects.toThrow(
        ForbiddenException,
      );
      expect(prisma.backgroundJob.findFirst).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when an active job already exists for the listing', async () => {
      prisma.backgroundJob.findFirst = jest.fn().mockResolvedValue(dbJobRecord);

      await expect(service.create(createDto, requestingUser)).rejects.toThrow(
        new ConflictException(
          `Listing with ID: ${listingId} has a currently running job assigned`,
        ),
      );
    });
  });

  describe('getById', () => {
    it('should return a BackgroundJob when the job exists', async () => {
      prisma.backgroundJob.findFirstOrThrow = jest
        .fn()
        .mockResolvedValue(dbJobRecord);

      const result = await service.getById(jobId, requestingUser);

      expect(result).toBeInstanceOf(BackgroundJob);
      expect(result.listingId).toBe(listingId);
      expect(result.status).toBe(BackgroundJobStatusEnum.processing);
      expect(prisma.backgroundJob.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: jobId },
      });
    });

    it('should throw NotFoundException when the job does not exist', async () => {
      prisma.backgroundJob.findFirstOrThrow = jest
        .fn()
        .mockRejectedValue(new Error('Not found'));

      await expect(
        service.getById('non-existent-id', requestingUser),
      ).rejects.toThrow(
        new NotFoundException(`Job with id: non-existent-id was not found`),
      );
    });
  });

  describe('findActiveForListing', () => {
    it('should return a BackgroundJob when an active processing job exists', async () => {
      prisma.backgroundJob.findFirst = jest.fn().mockResolvedValue(dbJobRecord);
      const result = await service.findActiveForListing(
        listingId,
        requestingUser,
      );

      expect(result).toBeInstanceOf(BackgroundJob);
      expect(result?.listingId).toBe(listingId);
      expect(result?.status).toBe(BackgroundJobStatusEnum.processing);
      expect(prisma.backgroundJob.findFirst).toHaveBeenCalledWith({
        where: {
          listingId,
          status: BackgroundJobStatusEnum.processing,
        },
      });
    });

    it('should return null when no active processing job exists for the listing', async () => {
      prisma.backgroundJob.findFirst = jest.fn().mockResolvedValue(null);
      const result = await service.findActiveForListing(
        listingId,
        requestingUser,
      );

      expect(result).toBeNull();
    });
  });

  describe('findActiveJob', () => {
    it('should return true when a processing job exists', async () => {
      prisma.backgroundJob.findFirst = jest.fn().mockResolvedValue(dbJobRecord);
      const result = await service.findActiveJob(requestingUser);

      expect(result).toBe(true);
      expect(prisma.backgroundJob.findFirst).toHaveBeenCalledWith({
        select: { id: true },
        where: {
          status: BackgroundJobStatusEnum.processing,
        },
      });
    });

    it('should return false when no processing job exists', async () => {
      prisma.backgroundJob.findFirst = jest.fn().mockResolvedValue(null);
      const result = await service.findActiveJob(requestingUser);

      expect(result).toBe(false);
    });
  });
});
