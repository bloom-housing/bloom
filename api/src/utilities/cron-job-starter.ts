import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import dayjs from 'dayjs';
import { PrismaService } from '../services/prisma.service';
import { SuccessDTO } from '../dtos/shared/success.dto';

/**
 *
 * @param prisma the instantiated prisma service from the service attempting to create a new cronjob
 * @param cronName this is the name of the cronjob we will be using
 * @param cronString this is the cron string, to tell the cron job how frequently to run
 * @param functionToCall this is the function signature for the function to execute on cron run
 * @param logger the Logger to log information, should be Direct Injected into the service calling this function
 * @param schedulerRegistry the nestjs schedule, should be Direct Injected into the service calling this function
 * @description this function will start a nestJs cron job, calling the <functionToCall> on <cronString> frequency. We check to see if there already is a job running in our cronjob table
 */
export const startCronJob = (
  prisma: PrismaService,
  cronName: string,
  cronString: string,
  functionToCall: () => Promise<SuccessDTO>,
  logger: Logger,
  schedulerRegistry: SchedulerRegistry,
): void => {
  if (!cronString) {
    // If missing cron string an error should throw but not prevent the app from starting up
    logger.error(
      `${cronName} cron string does not exist and ${cronName} job will not run`,
    );
    return;
  }
  // Take the cron job frequency from .env and add a random seconds to it.
  // That way when there are multiple instances running they won't run at the exact same time.
  const repeatCron = cronString;
  const randomSecond = Math.floor(Math.random() * 30);
  const newCron = `${randomSecond * 2} ${repeatCron}`;
  const job = new CronJob(
    newCron,
    () => {
      void (async () => {
        const currentCronJob = await prisma.cronJob.findFirst({
          where: {
            name: cronName,
          },
        });
        // To prevent multiple overlapped jobs only run if one hasn't started in the last 5 minutes
        if (
          !currentCronJob ||
          currentCronJob.lastRunDate <
            dayjs(new Date()).subtract(5, 'minutes').toDate()
        ) {
          try {
            await functionToCall();
          } catch (e) {
            logger.error(`${cronName} failed to run. ${e}`);
          }
        }
      })();
    },
    undefined,
    undefined,
    process.env.TIME_ZONE,
  );
  schedulerRegistry.addCronJob(cronName, job);
  if (process.env.NODE_ENV !== 'test') {
    job.start();
  }
};
