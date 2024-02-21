import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaModule } from './prisma.module';
import { EmailModule } from './email.module';
import { PermissionModule } from './permission.module';
import { UserCsvExporterService } from '../services/user-csv-export.service';

@Module({
  imports: [PrismaModule, EmailModule, PermissionModule],
  controllers: [UserController],
  providers: [Logger, UserService, ConfigService, UserCsvExporterService],
  exports: [UserService],
})
export class UserModule {}
