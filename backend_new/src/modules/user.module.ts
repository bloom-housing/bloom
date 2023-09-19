import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaModule } from './prisma.module';
import { EmailModule } from './email.module';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [UserController],
  providers: [UserService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
