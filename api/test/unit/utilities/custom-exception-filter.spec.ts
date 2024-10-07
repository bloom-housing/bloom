import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/modules/app.module';
import { PrismaService } from '../../../src/services/prisma.service';
import { CustomExceptionFilter } from '../../../src/utilities/custom-exception-filter';

describe('Testing custom exception filter', () => {
  let app: INestApplication;
  let logger: Logger;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    const { httpAdapter } = app.get(HttpAdapterHost);
    logger = moduleFixture.get<Logger>(Logger);
    app.useGlobalFilters(new CustomExceptionFilter(httpAdapter, logger));

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('should force an error and that error should go through the central logger', async () => {
    prisma.$queryRaw = jest.fn().mockImplementation(() => {
      throw new Error('We forced an error');
    });
    const spyOn = jest.spyOn(logger, 'error');
    await request(app.getHttpServer()).get('/').expect(500);

    expect(spyOn).toHaveBeenCalled();
  });
});
