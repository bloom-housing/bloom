import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { CookieOptions } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { randomInt } from 'crypto';
import { Prisma } from '@prisma/client';
import { UpdatePassword } from '../dtos/auth/update-password.dto';
import { MfaType } from '../enums/mfa/mfa-type-enum';
import { isPasswordValid, passwordToHash } from '../utilities/password-helpers';
import { RequestMfaCodeResponse } from '../dtos/mfa/request-mfa-code-response.dto';
import { RequestMfaCode } from '../dtos/mfa/request-mfa-code.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { PrismaService } from './prisma.service';
import { UserService } from './user.service';
import { IdDTO } from '../dtos/shared/id.dto';
import { mapTo } from '../utilities/mapTo';
import { Confirm } from '../dtos/auth/confirm.dto';
import { SmsService } from './sms.service';
import { EmailService } from './email.service';

// since our local env doesn't have an https cert we can't be secure. Hosted envs should be secure
const secure = process.env.NODE_ENV !== 'development';
const sameSite = process.env.NODE_ENV === 'development' ? 'strict' : 'none';

const TOKEN_COOKIE_MAXAGE = 86400000; // 24 hours
export const TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_COOKIE_NAME = 'refresh-token';
export const ACCESS_TOKEN_AVAILABLE_NAME = 'access-token-available';
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  maxAge: TOKEN_COOKIE_MAXAGE / 24, // access token should last 1 hr
};
export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: TOKEN_COOKIE_MAXAGE,
};
export const ACCESS_TOKEN_AVAILABLE_OPTIONS: CookieOptions = {
  ...AUTH_COOKIE_OPTIONS,
  httpOnly: false,
};

type IdAndEmail = {
  id: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private smsService: SmsService,
    private emailsService: EmailService,
  ) {}

  /*
    generates a signed token for a user
    willBeRefreshToken changes the TTL of the token with true being longer and false being shorter 
    willBeRefreshToken is true when trying to sign a refresh token instead of the standard auth token
  */
  generateAccessToken(user: User, willBeRefreshToken?: boolean): string {
    const payload = {
      sub: user.id,
      expiresIn: willBeRefreshToken
        ? REFRESH_COOKIE_OPTIONS.maxAge
        : AUTH_COOKIE_OPTIONS.maxAge,
    };
    return sign(payload, process.env.APP_SECRET);
  }

  /*
    this sets credentials as part of the response's cookies
    handles the storage and creation of these credentials
  */
  async setCredentials(
    res: Response,
    user: User,
    incomingRefreshToken?: string,
  ): Promise<SuccessDTO> {
    if (!user?.id) {
      throw new UnauthorizedException('no user found');
    }

    if (incomingRefreshToken) {
      // if token is provided, verify that its the correct refresh token
      const userCount = await this.prisma.userAccounts.count({
        where: {
          id: user.id,
          activeRefreshToken: incomingRefreshToken,
        },
      });

      if (!userCount) {
        // if the incoming refresh token is not the active refresh token for the user, clear the user's tokens
        await this.prisma.userAccounts.update({
          data: {
            activeAccessToken: null,
            activeRefreshToken: null,
          },
          where: {
            id: user.id,
          },
        });
        res.clearCookie(TOKEN_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
        res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
        res.clearCookie(
          ACCESS_TOKEN_AVAILABLE_NAME,
          ACCESS_TOKEN_AVAILABLE_OPTIONS,
        );

        throw new UnauthorizedException(
          `User ${user.id} was attempting to use outdated token ${incomingRefreshToken} to generate new tokens`,
        );
      }
    }

    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateAccessToken(user, true);

    // store access and refresh token into db
    await this.prisma.userAccounts.update({
      data: {
        activeAccessToken: accessToken,
        activeRefreshToken: newRefreshToken,
      },
      where: {
        id: user.id,
      },
    });

    res.cookie(TOKEN_COOKIE_NAME, accessToken, AUTH_COOKIE_OPTIONS);
    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie(
      ACCESS_TOKEN_AVAILABLE_NAME,
      'True',
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    this clears credentials from response and the db
  */
  async clearCredentials(res: Response, user: User): Promise<SuccessDTO> {
    if (!user?.id) {
      throw new UnauthorizedException('no user found');
    }

    // clear access and refresh tokens from db
    await this.prisma.userAccounts.update({
      data: {
        activeAccessToken: null,
        activeRefreshToken: null,
      },
      where: {
        id: user.id,
      },
    });

    res.clearCookie(TOKEN_COOKIE_NAME, AUTH_COOKIE_OPTIONS);
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
    res.clearCookie(
      ACCESS_TOKEN_AVAILABLE_NAME,
      ACCESS_TOKEN_AVAILABLE_OPTIONS,
    );

    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    verifies that the requesting user can/should be provided an mfa code
    generates then sends an mfa code to a users phone or email
  */
  async requestMfaCode(dto: RequestMfaCode): Promise<RequestMfaCodeResponse> {
    const user = await this.userService.findUserOrError(
      { email: dto.email },
      true,
    );

    if (!user.mfaEnabled) {
      throw new UnauthorizedException(
        `user ${dto.email} requested an mfa code, but has mfa disabled`,
      );
    }

    if (!(await isPasswordValid(user.passwordHash, dto.password))) {
      throw new UnauthorizedException(
        `user ${dto.email} requested an mfa code, but provided incorrect password`,
      );
    }

    if (dto.mfaType === MfaType.sms) {
      if (dto.phoneNumber) {
        if (!user.phoneNumberVerified) {
          user.phoneNumber = dto.phoneNumber;
        } else {
          throw new UnauthorizedException(
            'phone number can only be specified the first time using mfa',
          );
        }
      } else if (!dto.phoneNumber && !user.phoneNumber) {
        throw new UnauthorizedException({
          name: 'phoneNumberMissing',
          message: 'no valid phone number was found',
        });
      }
    }

    const mfaCode = this.generateMfaCode();
    await this.prisma.userAccounts.update({
      data: {
        mfaCode,
        mfaCodeUpdatedAt: new Date(),
        phoneNumber: user.phoneNumber,
      },
      where: {
        id: user.id,
      },
    });

    if (dto.mfaType === MfaType.email) {
      await this.emailsService.sendMfaCode(mapTo(User, user), mfaCode);
    } else if (dto.mfaType === MfaType.sms) {
      await this.smsService.sendMfaCode(user.phoneNumber, mfaCode);
    }

    return dto.mfaType === MfaType.email
      ? { email: user.email, phoneNumberVerified: user.phoneNumberVerified }
      : {
          phoneNumber: user.phoneNumber,
          phoneNumberVerified: user.phoneNumberVerified,
        };
  }

  /*
    updates a user's password and logs them in
  */
  async updatePassword(
    dto: UpdatePassword,
    res: Response,
  ): Promise<SuccessDTO> {
    const user = await this.prisma.userAccounts.findFirst({
      where: { resetToken: dto.token },
    });

    if (!user) {
      throw new NotFoundException(
        `user resetToken: ${dto.token} was requested but not found`,
      );
    }

    const token: IdDTO = verify(dto.token, process.env.APP_SECRET) as IdDTO;

    if (token.id !== user.id) {
      throw new UnauthorizedException(
        `resetToken ${dto.token} does not match user ${user.id}'s reset token (${user.resetToken})`,
      );
    }

    await this.prisma.userAccounts.update({
      data: {
        passwordHash: await passwordToHash(dto.password),
        passwordUpdatedAt: new Date(),
        resetToken: null,
      },
      where: {
        id: user.id,
      },
    });

    return await this.setCredentials(res, mapTo(User, user));
  }

  /*
    confirms a user and logs them in
  */
  async confirmUser(dto: Confirm, res?: Response): Promise<SuccessDTO> {
    const token = verify(dto.token, process.env.APP_SECRET) as IdAndEmail;

    let user = await this.userService.findUserOrError(
      { userId: token.id },
      false,
    );

    if (user.confirmationToken !== dto.token) {
      throw new BadRequestException(
        `Confirmation token mismatch for user stored: ${user.confirmationToken}, incoming token: ${dto.token}`,
      );
    }

    const data: Prisma.UserAccountsUpdateInput = {
      confirmedAt: new Date(),
      confirmationToken: null,
    };

    if (dto.password) {
      data.passwordHash = await passwordToHash(dto.password);
      data.passwordUpdatedAt = new Date();
    }

    if (token.email) {
      data.email = token.email;
    }

    user = await this.prisma.userAccounts.update({
      data,
      where: {
        id: user.id,
      },
    });

    return await this.setCredentials(res, mapTo(User, user));
  }

  /*
    generates a numeric mfa code
  */
  generateMfaCode() {
    let out = '';
    const characters = '0123456789';
    for (let i = 0; i < Number(process.env.MFA_CODE_LENGTH); i++) {
      out += characters.charAt(randomInt(characters.length));
    }
    return out;
  }
}
