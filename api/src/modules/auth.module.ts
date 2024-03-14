import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { PrismaModule } from './prisma.module';
import { SmsModule } from './sms-module';
import { UserModule } from './user.module';
import { MfaStrategy } from '../passports/mfa.strategy';
import { JwtStrategy } from '../passports/jwt.strategy';
import { EmailModule } from './email.module';
import { SingleUseCodeStrategy } from '../passports/single-use-code.strategy';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    SmsModule,
    PassportModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PermissionService,
    MfaStrategy,
    JwtStrategy,
    SingleUseCodeStrategy,
  ],
  exports: [AuthService, PermissionService],
})
export class AuthModule {}
