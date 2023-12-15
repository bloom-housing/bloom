import { Strategy } from 'passport-local';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../dtos/users/user.dto';
import { PrismaService } from '../services/prisma.service';
import { mapTo } from '../utilities/mapTo';
import {
  isPasswordOutdated,
  isPasswordValid,
} from '../utilities/password-helpers';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { Login } from '../dtos/auth/login.dto';
import { MfaType } from '../enums/mfa/mfa-type-enum';

@Injectable()
export class MfaStrategy extends PassportStrategy(Strategy, 'mfa') {
  constructor(private prisma: PrismaService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  /*
    verifies that the incoming log in information is valid
    returns the verified user
  */
  async validate(req: Request): Promise<User> {
    const validationPipe = new ValidationPipe(defaultValidationPipeOptions);
    const dto: Login = await validationPipe.transform(req.body, {
      type: 'body',
      metatype: Login,
    });

    const rawUser = await this.prisma.userAccounts.findFirst({
      include: {
        userRoles: true,
        listings: true,
        jurisdictions: true,
      },
      where: {
        email: dto.email,
      },
    });
    if (!rawUser) {
      throw new UnauthorizedException(
        `user ${dto.email} attempted to log in, but does not exist`,
      );
    } else if (
      rawUser.lastLoginAt &&
      rawUser.failedLoginAttemptsCount >=
        Number(process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS)
    ) {
      // if a user has logged in, but has since gone over their max failed login attempts
      const retryAfter = new Date(
        rawUser.lastLoginAt.getTime() +
          Number(process.env.AUTH_LOCK_LOGIN_COOLDOWN),
      );
      if (retryAfter <= new Date()) {
        // if we have passed the login lock TTL, reset login lock countdown
        rawUser.failedLoginAttemptsCount = 0;
      } else {
        // if the login lock is still a valid lock, error
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'Too Many Requests',
            message: 'Failed login attempts exceeded.',
            retryAfter,
          },
          429,
        );
      }
    } else if (!rawUser.confirmedAt) {
      // if user is not confirmed already
      throw new UnauthorizedException(
        `user ${rawUser.id} attempted to login, but is not confirmed`,
      );
    } else if (
      isPasswordOutdated(
        rawUser.passwordValidForDays,
        rawUser.passwordUpdatedAt,
      )
    ) {
      // if password TTL is expired
      throw new UnauthorizedException(
        `user ${rawUser.id} attempted to login, but password is no longer valid`,
      );
    } else if (!(await isPasswordValid(rawUser.passwordHash, dto.password))) {
      // if incoming password does not match
      await this.updateFailedLoginCount(
        rawUser.failedLoginAttemptsCount + 1,
        rawUser.id,
      );
      throw new UnauthorizedException({
        failureCountRemaining:
          Number(process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS) -
          rawUser.failedLoginAttemptsCount,
      });
    }

    if (!rawUser.mfaEnabled) {
      // if user is not an mfaEnabled user
      await this.updateStoredUser(null, null, null, 0, rawUser.id);
      return mapTo(User, rawUser);
    }

    let authSuccess = true;
    if (!dto.mfaCode || !rawUser.mfaCode || !rawUser.mfaCodeUpdatedAt) {
      // if an mfaCode was not sent, and an mfaCode wasn't stored in the db for the user
      // signal to the front end to request an mfa code
      await this.updateFailedLoginCount(0, rawUser.id);
      throw new UnauthorizedException({
        name: 'mfaCodeIsMissing',
      });
    } else if (
      new Date(
        rawUser.mfaCodeUpdatedAt.getTime() + Number(process.env.MFA_CODE_VALID),
      ) < new Date() ||
      rawUser.mfaCode !== dto.mfaCode
    ) {
      // if mfaCode TTL has expired, or if the mfa code input was incorrect
      authSuccess = false;
    } else {
      // if mfaCode login was a success
      rawUser.mfaCode = null;
      rawUser.mfaCodeUpdatedAt = new Date();
    }

    if (!authSuccess) {
      // if we failed login validation
      rawUser.failedLoginAttemptsCount += 1;
      await this.updateStoredUser(
        rawUser.mfaCode,
        rawUser.mfaCodeUpdatedAt,
        rawUser.phoneNumberVerified,
        rawUser.failedLoginAttemptsCount,
        rawUser.id,
      );
      throw new UnauthorizedException({
        message: 'mfaUnauthorized',
        failureCountRemaining:
          Number(process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS) +
          1 -
          rawUser.failedLoginAttemptsCount,
      });
    }
    // if the password and mfa code was valid
    rawUser.failedLoginAttemptsCount = 0;
    if (!rawUser.phoneNumberVerified && dto.mfaType === MfaType.sms) {
      // if the phone number was not verfied, but this mfa login was done through sms
      // then we should consider the phone number verified
      rawUser.phoneNumberVerified = true;
    }

    await this.updateStoredUser(
      rawUser.mfaCode,
      rawUser.mfaCodeUpdatedAt,
      rawUser.phoneNumberVerified,
      rawUser.failedLoginAttemptsCount,
      rawUser.id,
    );
    return mapTo(User, rawUser);
  }

  async updateFailedLoginCount(count: number, userId: string): Promise<void> {
    await this.prisma.userAccounts.update({
      data: {
        failedLoginAttemptsCount: count,
      },
      where: {
        id: userId,
      },
    });
  }

  async updateStoredUser(
    mfaCode: string,
    mfaCodeUpdatedAt: Date,
    phoneNumberVerified: boolean,
    failedLoginAttemptsCount: number,
    userId: string,
  ): Promise<void> {
    await this.prisma.userAccounts.update({
      data: {
        mfaCode,
        mfaCodeUpdatedAt,
        phoneNumberVerified,
        failedLoginAttemptsCount,
        lastLoginAt: new Date(),
      },
      where: {
        id: userId,
      },
    });
  }
}
