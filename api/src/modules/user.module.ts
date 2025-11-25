import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserController } from '../controllers/user.controller';
import { UserCsvExporterService } from '../services/user-csv-export.service';
import { UserService } from '../services/user.service';
import { ApplicationModule } from './application.module';
import { CronJobModule } from './cron-job.module';
import { EmailModule } from './email.module';
import { PermissionModule } from './permission.module';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    PermissionModule,
    CronJobModule,
    ApplicationModule,
  ],
  controllers: [UserController],
  providers: [Logger, UserService, ConfigService, UserCsvExporterService],
  exports: [UserService],
})
export class UserModule {}
