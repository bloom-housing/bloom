import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PaperApplication } from '../dtos/paper-applications/paper-application-get.dto';
import { PaperApplicationCreate } from '../dtos/paper-applications/paper-application-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { Prisma } from '@prisma/client';

/*
  this is the service for paper applications
  it handles all the backend's business logic for reading/writing/deleting paper application data
*/

const view: Prisma.PaperApplicationsInclude = {
  assets: true,
};

@Injectable()
export class PaperApplicationService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of paper applications given the params passed in
  */
  async list() {
    const rawPaperApplications = await this.prisma.paperApplications.findMany({
      include: view,
    });
    return mapTo(PaperApplication, rawPaperApplications);
  }

  /*
    this will return 1 paper application or error
  */
  async findOne(paperApplicationId: string) {
    const rawPaperApplication = await this.prisma.paperApplications.findFirst({
      include: view,
      where: {
        id: {
          equals: paperApplicationId,
        },
      },
    });

    if (!rawPaperApplication) {
      throw new NotFoundException();
    }

    return mapTo(PaperApplication, rawPaperApplication);
  }

  /*
    this will create a paper application
  */
  async create(incomingData: PaperApplicationCreate) {
    const rawResult = await this.prisma.paperApplications.create({
      data: {
        ...incomingData,
        assets: incomingData.assets
          ? {
              create: {
                fileId: incomingData.assets.fileId,
                label: incomingData.assets.label,
              },
            }
          : null,
      },
      include: view,
    });

    return mapTo(PaperApplication, rawResult);
  }

  /*
    this will update a paper application's name or items field
    if no paper application has the id of the incoming argument an error is thrown
  */
  async update(incomingData: PaperApplicationCreate) {
    const paperApplication = await this.prisma.paperApplications.findFirst({
      where: {
        id: incomingData.id,
      },
      include: view,
    });

    if (!paperApplication) {
      throw new NotFoundException();
    }

    const rawResults = await this.prisma.paperApplications.update({
      data: {
        ...incomingData,
        assets: incomingData.assets
          ? {
              create: {
                fileId: incomingData.assets.fileId,
                label: incomingData.assets.label,
              },
            }
          : null,
        id: undefined,
      },
      where: {
        id: incomingData.id,
      },
      include: view,
    });

    if (paperApplication.assets?.id) {
      // clearing old asset data
      await this.prisma.assets.delete({
        where: {
          id: paperApplication.assets.id,
        },
      });
    }

    return mapTo(PaperApplication, rawResults);
  }

  /*
    this will delete a paper application
  */
  async delete(paperApplicationId: string) {
    const res = await this.prisma.paperApplications.delete({
      include: view,
      where: {
        id: paperApplicationId,
      },
    });
    if (res && res.assets) {
      await this.prisma.assets.delete({
        where: {
          id: res.assets.id,
        },
      });
    }
    return {
      success: true,
    } as SuccessDTO;
  }
}
