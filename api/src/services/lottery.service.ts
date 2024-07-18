import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { PrismaService } from './prisma.service';
import {
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import { MultiselectQuestionService } from './multiselect-question.service';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import MultiselectQuestion from '../dtos/multiselect-questions/multiselect-question.dto';
import { User } from '../dtos/users/user.dto';
import { ListingService } from './listing.service';
import { mapTo } from '../utilities/mapTo';
import { Application } from '../dtos/applications/application.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { SuccessDTO } from 'src/dtos/shared/success.dto';

@Injectable()
export class LotteryService {
  readonly dateFormat: string = 'MM-DD-YYYY hh:mm:ssA z';
  constructor(
    private prisma: PrismaService,
    private multiselectQuestionService: MultiselectQuestionService,
    private listingService: ListingService,
  ) {}

  /**
   *
   * @param queryParams
   * @param req
   * @returns generates the lottery results for a listing
   */
  async lotteryGenerate<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<SuccessDTO> {
    const user = mapTo(User, req['user']);
    if (!user?.userRoles?.isAdmin) {
      throw new ForbiddenException();
    }
    const listing = await this.prisma.listings.findUnique({
      select: {
        id: true,
        lotteryLastRunAt: true,
        lotteryStatus: true,
      },
      where: {
        id: queryParams.listingId,
      },
    });
    if (listing?.lotteryStatus) {
      // if lottery has been run before
      throw new BadRequestException(
        `Listing ${queryParams.listingId}: the lottery was attempted to be generated but it was already run previously`,
      );
    }

    try {
      const applications = await this.prisma.applications.findMany({
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
          listingId: queryParams.listingId,
          deletedAt: null,
          markedAsDuplicate: false,
        },
      });

      // get all multiselect questions for a listing to build csv headers
      const multiSelectQuestions =
        await this.multiselectQuestionService.findByListingId(
          queryParams.listingId,
        );

      await this.lotteryRandomizer(
        queryParams.listingId,
        mapTo(Application, applications),
        multiSelectQuestions.filter(
          (multiselectQuestion) =>
            multiselectQuestion.applicationSection ===
            MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
      );

      await this.listingService.lotteryStatus(
        {
          listingId: queryParams.listingId,
          lotteryStatus: LotteryStatusEnum.ran,
        },
        user,
      );
    } catch (e) {
      console.error(e);
      await this.listingService.lotteryStatus(
        {
          listingId: queryParams.listingId,
          lotteryStatus: LotteryStatusEnum.errored,
        },
        user,
      );
      return { success: false };
    }
    return { success: true };
  }

  async lotteryRandomizer(
    listingId: string,
    applications: Application[],
    preferencesOnListing: MultiselectQuestion[],
  ): Promise<void> {
    // remove duplicates
    let filteredApplications = applications;
    // prep our supporting array
    const ordinalArray = this.lotteryRandomizerHelper(filteredApplications);

    // attach ordinal info to filteredApplications
    ordinalArray.forEach((value, i) => {
      filteredApplications[i].applicationLotteryPositions = [
        {
          listingId,
          applicationId: filteredApplications[i].id,
          ordinal: value,
          multiselectQuestionId: null,
        },
      ];
    });

    // store raw positional score in db
    await this.prisma.applicationLotteryPositions.createMany({
      data: filteredApplications.map((app, index) => ({
        listingId,
        applicationId: app.id,
        ordinal: ordinalArray[index],
        multiselectQuestionId: null,
      })),
    });

    // order by ordinal
    filteredApplications = filteredApplications.sort(
      (a, b) =>
        a.applicationLotteryPositions[0].ordinal -
        b.applicationLotteryPositions[0].ordinal,
    );

    // loop over each preference on the listing and store the relative position of the applications
    for (let i = 0; i < preferencesOnListing.length; i++) {
      const { id, text } = preferencesOnListing[i];

      const applicationsWithThisPreference: Application[] = [];
      const ordinalArrayWithThisPreference: number[] = [];

      // filter down to only the applications that have this particular preference
      let preferenceOrdinal = 1;
      for (let j = 0; j < filteredApplications.length; j++) {
        if (
          filteredApplications[j].preferences.some(
            (preference) => preference.key === text && preference.claimed,
          )
        ) {
          applicationsWithThisPreference.push(filteredApplications[j]);
          ordinalArrayWithThisPreference.push(preferenceOrdinal);
          preferenceOrdinal++;
        }
      }

      if (applicationsWithThisPreference.length) {
        // store these values in the db
        await this.prisma.applicationLotteryPositions.createMany({
          data: applicationsWithThisPreference.map((app, index) => ({
            listingId,
            applicationId: app.id,
            ordinal: ordinalArrayWithThisPreference[index],
            multiselectQuestionId: id,
          })),
        });
      }
    }
  }

  lotteryRandomizerHelper(filterApplicationsArray: Application[]): number[] {
    // prep our supporting array
    const ordinalArray: number[] = [];

    const indexArray: number[] = [];
    filterApplicationsArray.forEach((_, index) => {
      indexArray.push(index + 1);
    });

    // fill array with random values
    filterApplicationsArray.forEach(() => {
      // get random value
      const randomPosition = Math.floor(Math.random() * indexArray.length);

      // remove selected value from indexArray
      const randomValue = indexArray.splice(randomPosition, 1);

      // push unique random value into array
      ordinalArray.push(randomValue[0]);
    });

    return ordinalArray;
  }
}
