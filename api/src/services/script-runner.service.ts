import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request as ExpressRequest } from 'express';
import { PrismaService } from './prisma.service';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import { DataTransferDTO } from 'src/dtos/script-runner/data-transfer.dto';

/**
  this is the service for running scripts
  most functions in here will be unique, but each function should only be allowed to fire once
*/
@Injectable()
export class ScriptRunnerService {
  async dataTransfer(
    req: ExpressRequest,
    dataTransferDTO: DataTransferDTO,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('example', requestingUser);

    const client = new PrismaClient({
      datasources: {
        db: {
          url: dataTransferDTO.connectionString,
        },
      },
    });
    await client.$connect();

    const res =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = 'San Mateo'`;
    console.log(res);
    await client.$disconnect();

    await this.markScriptAsComplete('example', requestingUser);
    return { success: true };
  }
  constructor(private prisma: PrismaService) {}

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
