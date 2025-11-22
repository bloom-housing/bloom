import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CronJob } from 'cron';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import dayjs from 'dayjs';

@Injectable()
export class CronJobService {
  constructor(
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(CronJobService.name),
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async startCronJob(
    cronName: string,
    cronString: string,
    functionToCall: () => Promise<SuccessDTO>,
  ) {
    if (!cronString) {
      // If missing cron string an error should throw but not prevent the app from starting up
      this.logger.error(
        `${cronName} cron string does not exist and ${cronName} job will not run`,
      );
      return;
    }
    // Take the cron job frequency from .env and add a random seconds to it.
    // That way when there are multiple instances running they won't run at the exact same time.
    const repeatCron = cronString;
    const randomSecond = Math.floor(Math.random() * 30);
    const newCron = `${randomSecond * 2} ${repeatCron}`;
    const job: CronJob = new CronJob(
      newCron,
      () => {
        void (async () => {
          const currentCronJob = await this.prisma.cronJob.findFirst({
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
              this.logger.error(`${cronName} failed to run. ${e}`);
            }
          }
        })();
      },
      undefined,
      undefined,
      process.env.TIME_ZONE,
    );
    this.schedulerRegistry.addCronJob(cronName, job);
    if (process.env.NODE_ENV !== 'test') {
      job.start();
    }
  }

  /**
       marks the db record for this cronjob as begun or creates a cronjob that
       is marked as begun if one does not already exist
    */
  async markCronJobAsStarted(cronJobName: string): Promise<void> {
    const job = await this.prisma.cronJob.findFirst({
      where: {
        name: cronJobName,
      },
    });
    if (job) {
      // if a job exists then we update db entry
      await this.prisma.cronJob.update({
        data: {
          lastRunDate: new Date(),
        },
        where: {
          id: job.id,
        },
      });
    } else {
      // if no job we create a new entry
      await this.prisma.cronJob.create({
        data: {
          lastRunDate: new Date(),
          name: cronJobName,
        },
      });
    }
  }
}
