import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { paperApplicationFactory } from '../../prisma/seed-helpers/paper-application-factory';
import { PaperApplicationCreate } from '../../src/dtos/paper-applications/paper-application-create.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';
import { LanguagesEnum } from '@prisma/client';

describe('PaperApplication Controller Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const cleanUpDb = async (
    paperApplicationIds: string[],
    assetIds: string[],
  ) => {
    for (let i = 0; i < paperApplicationIds.length; i++) {
      await prisma.paperApplications.delete({
        where: {
          id: paperApplicationIds[i],
        },
      });
    }
    for (let i = 0; i < assetIds.length; i++) {
      await prisma.assets.delete({
        where: {
          id: assetIds[i],
        },
      });
    }
  };

  it('testing list endpoint', async () => {
    const paperApplicationA = await prisma.paperApplications.create({
      data: paperApplicationFactory(7),
      include: {
        assets: true,
      },
    });
    const paperApplicationB = await prisma.paperApplications.create({
      data: paperApplicationFactory(8),
      include: {
        assets: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/paperApplications`)
      .expect(200);

    expect(res.body.length).toEqual(2);
    const sortedResults = res.body.sort((a, b) =>
      a.assets.label < b.assets.label ? -1 : 1,
    );
    expect(sortedResults[0].assets.label).toEqual(
      paperApplicationA.assets.label,
    );
    expect(sortedResults[1].assets.label).toEqual(
      paperApplicationB.assets.label,
    );

    await cleanUpDb(
      [paperApplicationA.id, paperApplicationB.id],
      [paperApplicationA.assets.id, paperApplicationB.assets.id],
    );
  });

  it('testing retrieve endpoint', async () => {
    const paperApplicationA = await prisma.paperApplications.create({
      data: paperApplicationFactory(10),
      include: {
        assets: true,
      },
    });

    const res = await request(app.getHttpServer())
      .get(`/paperApplications/${paperApplicationA.id}`)
      .expect(200);

    expect(res.body.id).toEqual(paperApplicationA.id);

    await cleanUpDb([paperApplicationA.id], [paperApplicationA.assets.id]);
  });

  it('testing create endpoint', async () => {
    const res = await request(app.getHttpServer())
      .post('/paperApplications')
      .send({
        language: LanguagesEnum.tl,
        assets: {
          fileId: 'example file',
          label: 'example label',
        },
      } as PaperApplicationCreate)
      .expect(201);

    expect(res.body.language).toEqual(LanguagesEnum.tl);

    await cleanUpDb([res.body.id], [res.body.assets.id]);
  });

  it('testing update endpoint', async () => {
    const paperApplicationA = await prisma.paperApplications.create({
      data: paperApplicationFactory(10),
    });

    const res = await request(app.getHttpServer())
      .put(`/paperApplications/${paperApplicationA.id}`)
      .send({
        id: paperApplicationA.id,
        language: LanguagesEnum.tl,
        assets: {
          fileId: 'example file',
          label: 'example label',
        },
      } as PaperApplicationCreate)
      .expect(200);

    expect(res.body.id).toEqual(paperApplicationA.id);
    expect(res.body.assets.label).toEqual('example label');

    await cleanUpDb([paperApplicationA.id], [res.body.assets.id]);
  });

  it('testing delete endpoint', async () => {
    const paperApplicationA = await prisma.paperApplications.create({
      data: paperApplicationFactory(16),
    });

    const res = await request(app.getHttpServer())
      .delete(`/paperApplications`)
      .send({
        id: paperApplicationA.id,
      } as IdDTO)
      .expect(200);

    expect(res.body.success).toEqual(true);
  });
});
