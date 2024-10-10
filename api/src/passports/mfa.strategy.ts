import { Strategy } from 'passport-local';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import {
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
import {
  isUserLockedOut,
  singleUseCodePresent,
  singleUseCodeInvalid,
} from '../utilities/passport-validator-utilities';

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
    }
    isUserLockedOut(
      rawUser.lastLoginAt,
      rawUser.failedLoginAttemptsCount,
      Number(process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS),
      Number(process.env.AUTH_LOCK_LOGIN_COOLDOWN),
    );
    if (!(await isPasswordValid(rawUser.passwordHash, dto.password))) {
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
    }

    if (!rawUser.mfaEnabled) {
      // if user is not an mfaEnabled user
      await this.updateStoredUser(null, null, null, 0, rawUser.id);
      return mapTo(User, rawUser);
    }

    let authSuccess = true;
    if (
      !singleUseCodePresent(
        dto.mfaCode,
        rawUser.singleUseCode,
        rawUser.singleUseCodeUpdatedAt,
      )
    ) {
      // if an mfaCode was not sent, and a singleUseCode wasn't stored in the db for the user
      // signal to the front end to request an mfa code
      await this.updateFailedLoginCount(0, rawUser.id);
      throw new UnauthorizedException({
        name: 'mfaCodeIsMissing',
      });
    } else if (
      singleUseCodeInvalid(
        rawUser.singleUseCodeUpdatedAt,
        Number(process.env.MFA_CODE_VALID),
        dto.mfaCode,
        rawUser.singleUseCode,
      )
    ) {
      // if mfaCode TTL has expired, or if the mfa code input was incorrect
      authSuccess = false;
    } else {
      // if mfaCode login was a success
      rawUser.singleUseCode = null;
      rawUser.singleUseCodeUpdatedAt = new Date();
    }

    if (!authSuccess) {
      // if we failed login validation
      rawUser.failedLoginAttemptsCount += 1;
      await this.updateStoredUser(
        rawUser.singleUseCode,
        rawUser.singleUseCodeUpdatedAt,
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
      rawUser.singleUseCode,
      rawUser.singleUseCodeUpdatedAt,
      rawUser.phoneNumberVerified,
      rawUser.failedLoginAttemptsCount,
      rawUser.id,
    );
    return mapTo(User, rawUser);
  }

  async updateFailedLoginCount(count: number, userId: string): Promise<void> {
    let lastLoginAt = undefined;
    if (count === 1) {
      // if the count went from 0 -> 1 then we update the lastLoginAt so the count of failed attempts falls off properly
      lastLoginAt = new Date();
    }
    await this.prisma.userAccounts.update({
      data: {
        failedLoginAttemptsCount: count,
        lastLoginAt,
      },
      where: {
        id: userId,
      },
    });
  }

  async updateStoredUser(
    singleUseCode: string,
    singleUseCodeUpdatedAt: Date,
    phoneNumberVerified: boolean,
    failedLoginAttemptsCount: number,
    userId: string,
  ): Promise<void> {
    await this.prisma.userAccounts.update({
      data: {
        singleUseCode,
        singleUseCodeUpdatedAt,
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
