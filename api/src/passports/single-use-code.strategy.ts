import { Strategy } from 'passport-local';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../dtos/users/user.dto';
import { PrismaService } from '../services/prisma.service';
import { mapTo } from '../utilities/mapTo';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { LoginViaSingleUseCode } from '../dtos/auth/login-single-use-code.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import {
  checkUserLockout,
  singleUseCodePresent,
  singleUseCodeInvalid,
} from '../utilities/passport-validator-utilities';

@Injectable()
export class SingleUseCodeStrategy extends PassportStrategy(
  Strategy,
  'single-use-code',
) {
  constructor(private prisma: PrismaService) {
    super({
      usernameField: 'email',
      passwordField: 'singleUseCode',
      passReqToCallback: true,
    });
  }

  /*
    verifies that the incoming log in information is valid
    returns the verified user
  */
  async validate(req: Request): Promise<User> {
    const validationPipe = new ValidationPipe(defaultValidationPipeOptions);
    const dto: LoginViaSingleUseCode = await validationPipe.transform(
      req.body,
      {
        type: 'body',
        metatype: LoginViaSingleUseCode,
      },
    );
    const jurisName = req?.headers?.jurisdictionname;
    if (!jurisName) {
      throw new BadRequestException(
        'jurisdictionname is missing from the request headers',
      );
    }

    const juris = await this.prisma.jurisdictions.findFirst({
      select: {
        id: true,
        allowSingleUseCodeLogin: true,
      },
      where: {
        name: jurisName as string,
      },
      orderBy: {
        allowSingleUseCodeLogin: OrderByEnum.DESC,
      },
    });
    if (!juris) {
      throw new BadRequestException(
        `Jurisidiction ${jurisName} does not exists`,
      );
    }

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

    if (!rawUser.agreedToTermsOfService && !dto.agreedToTermsOfService) {
      throw new BadRequestException(
        `User ${rawUser.id} has not accepted the terms of service`,
      );
    }

    rawUser.failedLoginAttemptsCount = checkUserLockout(
      rawUser.lastLoginAt,
      rawUser.failedLoginAttemptsCount,
      Number(process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS),
      Number(process.env.AUTH_LOCK_LOGIN_COOLDOWN),
    );

    let authSuccess = true;
    if (
      !singleUseCodePresent(
        dto.singleUseCode,
        rawUser.singleUseCode,
        rawUser.singleUseCodeUpdatedAt,
      )
    ) {
      // if a singleUseCode was not sent, or a singleUseCode wasn't stored in the db for the user
      // signal to the front end to request an single use code
      await this.updateFailedLoginCount(0, rawUser.id);
      throw new UnauthorizedException({
        name: 'singleUseCodeIsMissing',
      });
    } else if (
      singleUseCodeInvalid(
        rawUser.singleUseCodeUpdatedAt,
        Number(process.env.MFA_CODE_VALID),
        dto.singleUseCode,
        rawUser.singleUseCode,
      )
    ) {
      // if singleUseCode TTL has expired, or if the code input was incorrect
      authSuccess = false;
    } else {
      // if login was a success
      rawUser.singleUseCode = null;
      rawUser.singleUseCodeUpdatedAt = new Date();
    }

    if (!authSuccess) {
      // if we failed login validation
      rawUser.failedLoginAttemptsCount += 1;
      await this.updateStoredUser(
        rawUser.singleUseCode,
        rawUser.singleUseCodeUpdatedAt,
        rawUser.failedLoginAttemptsCount,
        rawUser.id,
      );
      throw new UnauthorizedException({
        message: 'singleUseCodeUnauthorized',
        failureCountRemaining:
          Number(process.env.AUTH_LOCK_LOGIN_AFTER_FAILED_ATTEMPTS) +
          1 -
          rawUser.failedLoginAttemptsCount,
      });
    }

    // if the password and single use code was valid
    rawUser.failedLoginAttemptsCount = 0;

    await this.updateStoredUser(
      rawUser.singleUseCode,
      rawUser.singleUseCodeUpdatedAt,
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
    failedLoginAttemptsCount: number,
    userId: string,
  ): Promise<void> {
    await this.prisma.userAccounts.update({
      data: {
        singleUseCode,
        singleUseCodeUpdatedAt,
        failedLoginAttemptsCount,
        lastLoginAt: new Date(),
      },
      where: {
        id: userId,
      },
    });
  }
}
