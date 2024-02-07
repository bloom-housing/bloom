import fs from 'fs';
import { join } from 'path';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { startCronJob } from '../utilities/cron-job-starter';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PrismaService } from './prisma.service';

const CRON_JOB_NAME = 'TEMP_FILE_CLEAR_CRON_JOB';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(AppService.name),
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    startCronJob(
      this.prisma,
      CRON_JOB_NAME,
      process.env.TEMP_FILE_CLEAR_CRON_STRING,
      this.clearTempFiles.bind(this),
      this.logger,
      this.schedulerRegistry,
    );
  }

  async healthCheck(): Promise<SuccessDTO> {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      success: true,
    } as SuccessDTO;
  }

  /**
    runs the job to remove existing csvs and zip files
  */
  async clearTempFiles(): Promise<SuccessDTO> {
    this.logger.warn('listing csv clear job running');
    await this.markCronJobAsStarted();
    let filesDeletedCount = 0;
    await fs.readdir(join(process.cwd(), 'src/temp/'), (err, files) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
      Promise.all(
        files.map((f) => {
          if (!f.includes('.git')) {
            filesDeletedCount++;
            try {
              fs.rm(
                join(process.cwd(), 'src/temp/', f),
                { recursive: true },
                (err) => {
                  if (err) {
                    throw new InternalServerErrorException(err);
                  }
                },
              );
            } catch (e) {
              throw new InternalServerErrorException(e);
            }
          }
        }),
      );
      this.logger.warn(
        `listing csv clear job completed: ${filesDeletedCount} files were deleted`,
      );
    });
    return {
      success: true,
    };
  }

  /**
      marks the db record for this cronjob as begun or creates a cronjob that
      is marked as begun if one does not already exist 
      */
  async markCronJobAsStarted(): Promise<void> {
    const job = await this.prisma.cronJob.findFirst({
      where: {
        name: CRON_JOB_NAME,
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
          name: CRON_JOB_NAME,
        },
      });
    }
  }
}
