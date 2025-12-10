import fs from 'fs';
import { join } from 'path';
import {
  ImATeapotException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PrismaService } from './prisma.service';
import { CronJobService } from './cron-job.service';

const TEMP_FILE_CLEAR_CRON_JOB_NAME = 'TEMP_FILE_CLEAR_CRON_JOB';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(AppService.name),
    private cronJobService: CronJobService,
  ) {}

  onModuleInit() {
    this.cronJobService.startCronJob(
      TEMP_FILE_CLEAR_CRON_JOB_NAME,
      process.env.TEMP_FILE_CLEAR_CRON_STRING,
      this.clearTempFiles.bind(this),
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
    await this.cronJobService.markCronJobAsStarted(
      TEMP_FILE_CLEAR_CRON_JOB_NAME,
    );
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

  // art pulled from: https://www.asciiart.eu/food-and-drinks/coffee-and-tea
  async teapot(): Promise<SuccessDTO> {
    throw new ImATeapotException(`
                  ;,'
          _o_    ;:;'
      ,-.'---\`.__ ;
      ((j\`=====',-'
      \`-\     /
        \`-=-'     hjw
    `);
  }
}
