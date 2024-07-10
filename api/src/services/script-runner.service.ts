import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { PrismaService } from './prisma.service';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import { DataTransferDTO } from '../dtos/script-runner/data-transfer.dto';
import { BulkApplicationResendDTO } from '../dtos/script-runner/bulk-application-resend.dto';
import { EmailService } from './email.service';
import { Application } from '../dtos/applications/application.dto';
import { AmiChartImportDTO } from '../dtos/script-runner/ami-chart-import.dto';
import { AmiChartCreate } from '../dtos/ami-charts/ami-chart-create.dto';
import { AmiChartService } from './ami-chart.service';

/**
  this is the service for running scripts
  most functions in here will be unique, but each function should only be allowed to fire once
*/
@Injectable()
export class ScriptRunnerService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private amiChartService: AmiChartService,
  ) {}

  /**
   *
   * @param req incoming request object
   * @param dataTransferDTO data transfer endpoint args. Should contain foreign db connection string
   * @returns successDTO
   * @description transfers data from foreign data into the database this api normally connects to
   */
  async dataTransfer(
    req: ExpressRequest,
    dataTransferDTO: DataTransferDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('data transfer', requestingUser);

    // connect to foreign db based on incoming connection string
    const client = new PrismaClient({
      datasources: {
        db: {
          url: dataTransferDTO.connectionString,
        },
      },
    });
    await client.$connect();

    // get data
    const res =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = 'San Mateo'`;
    console.log(res);

    // disconnect from foreign db
    await client.$disconnect();

    // script runner standard spin down
    await this.markScriptAsComplete('data transfer', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param bulkApplicationResendDTO bulk resend arg. Should contain listing id
   * @returns successDTO
   * @description resends a confirmation email to all applicants on a listing with an email
   */
  async bulkApplicationResend(
    req: ExpressRequest,
    bulkApplicationResendDTO: BulkApplicationResendDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('bulk application resend', requestingUser);

    // gather listing data
    const listing = await this.prisma.listings.findUnique({
      select: {
        id: true,
        jurisdictions: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: bulkApplicationResendDTO.listingId,
      },
    });

    if (!listing || !listing.jurisdictions) {
      throw new BadRequestException('Listing does not exist');
    }

    // gather up all applications for that listing
    const rawApplications = await this.prisma.applications.findMany({
      select: {
        id: true,
        language: true,
        confirmationCode: true,
        applicant: {
          select: {
            id: true,
            emailAddress: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      where: {
        listingId: bulkApplicationResendDTO.listingId,
        deletedAt: null,
        applicant: {
          emailAddress: {
            not: null,
          },
        },
      },
    });
    const applications = mapTo(Application, rawApplications);

    // send emails
    for (const application of applications) {
      await this.emailService.applicationScriptRunner(
        mapTo(Application, application),
        { id: listing.jurisdictions.id },
      );
    }

    // script runner standard spin down
    await this.markScriptAsComplete('bulk application resend', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param amiChartImportDTO this is a string in a very specific format like:
   * percentOfAmiValue_1 householdSize_1_income_value householdSize_2_income_value \n percentOfAmiValue_2 householdSize_1_income_value householdSize_2_income_value
   *
   * Copying and pasting from google sheets will not match the format above. You will need to perform the following:
   * 1) Find and delete all instances of "%"
   * 2) Using the Regex option in the Find and Replace tool, replace /\t with " " and /\n with "\\n"
   * See "How to format AMI data for script runner import" in Notion for a more detailed example
   * @returns successDTO
   * @description takes the incoming AMI Chart string and stores it as a new AMI Chart in the database
   */
  async amiChartImport(
    req: ExpressRequest,
    amiChartImportDTO: AmiChartImportDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `AMI Chart ${amiChartImportDTO.name}`,
      requestingUser,
    );

    // parse incoming string into an amichart create dto
    const createDTO: AmiChartCreate = {
      items: [],
      name: amiChartImportDTO.name,
      jurisdictions: {
        id: amiChartImportDTO.jurisdictionId,
      },
    };

    const rows = amiChartImportDTO.values.split('\n');
    rows.forEach((row: string) => {
      const values = row.split(' ');
      const percentage = values[0];
      values.forEach((value: string, index: number) => {
        if (index > 0) {
          createDTO.items.push({
            percentOfAmi: Number(percentage),
            householdSize: index,
            income: Number(value),
          });
        }
      });
    });

    await this.amiChartService.create(createDTO);

    // script runner standard spin down
    await this.markScriptAsComplete(
      `AMI Chart ${amiChartImportDTO.name}`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param jurisdiction should contain jurisdiction id
   * @returns successDTO
   * @description adds lottery released translations to the database
   */
  async addLotteryReleasedTranslations(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'add lottery released translations',
      requestingUser,
    );
    const translations = await this.prisma.translations.findFirst({
      where: { language: 'en', jurisdictionId: null },
    });

    const translationsJSON =
      translations.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translations.id },
      data: {
        translations: {
          ...translationsJSON,
          lotteryReleased: {
            header: 'New lottery released',
            adminApprovedStart:
              'An admin has released lottery results for publication for the %{listingName} listing. Please log into the',
            adminApprovedEnd:
              'and navigate to the listing detail page to view the lottery tab and publish your results.',
          },
        },
      },
    });

    await this.markScriptAsComplete(
      'add lottery released translations',
      requestingUser,
    );

    return { success: true };
  }

  /**
    this is simply an example
  */
  async example(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('example', requestingUser);
    const rawJurisdictions = await this.prisma.jurisdictions.findMany();
    await this.markScriptAsComplete('example', requestingUser);
    return { success: !!rawJurisdictions.length };
  }

  // |------------------ HELPERS GO BELOW ------------------ | //

  /**
   *
   * @param scriptName the name of the script that is going to be run
   * @param userTriggeringTheRun the user that is attempting to trigger the script run
   * @description this checks to see if the script has already ran, if not marks the script in the db
   */
  async markScriptAsRunStart(
    scriptName: string,
    userTriggeringTheRun: User,
  ): Promise<void> {
    // check to see if script is already ran in db
    const storedScriptRun = await this.prisma.scriptRuns.findUnique({
      where: {
        scriptName,
      },
    });

    if (storedScriptRun?.didScriptRun) {
      // if script run has already successfully completed throw already succeed error
      throw new BadRequestException(
        `${scriptName} has already been run and succeeded`,
      );
    } else if (storedScriptRun?.didScriptRun === false) {
      // if script run was attempted but failed, throw attempt already failed error
      throw new BadRequestException(
        `${scriptName} has an attempted run and it failed, or is in progress. If it failed, please delete the db entry and try again`,
      );
    } else {
      // if no script run has been attempted create script run entry
      await this.prisma.scriptRuns.create({
        data: {
          scriptName,
          triggeringUser: userTriggeringTheRun.id,
        },
      });
    }
  }

  /**
   *
   * @param scriptName the name of the script that is going to be run
   * @param userTriggeringTheRun the user that is setting the script run as successfully completed
   * @description this marks the script run entry in the db as successfully completed
   */
  async markScriptAsComplete(
    scriptName: string,
    userTriggeringTheRun: User,
  ): Promise<void> {
    await this.prisma.scriptRuns.update({
      data: {
        didScriptRun: true,
        triggeringUser: userTriggeringTheRun.id,
      },
      where: {
        scriptName,
      },
    });
  }
}
