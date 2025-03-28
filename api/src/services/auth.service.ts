import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CookieOptions, Response } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { Confirm } from '../dtos/auth/confirm.dto';
import { UpdatePassword } from '../dtos/auth/update-password.dto';
import { RequestMfaCodeResponse } from '../dtos/mfa/request-mfa-code-response.dto';
import { RequestMfaCode } from '../dtos/mfa/request-mfa-code.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { MfaType } from '../enums/mfa/mfa-type-enum';
import { UserViews } from '../enums/user/view-enum';
import { getSingleUseCode } from '../utilities/get-single-use-code';
import { mapTo } from '../utilities/mapTo';
import { isPasswordValid, passwordToHash } from '../utilities/password-helpers';
import { EmailService } from './email.service';
import { PrismaService } from './prisma.service';
import { SmsService } from './sms.service';
import { UserService } from './user.service';
// since our local env doesn't have an https cert we can't be secure. Hosted envs should be secure
const secure =
  process.env.NODE_ENV !== 'development' && process.env.HTTPS_OFF !== 'true';
let sameSite: boolean | 'strict' | 'lax' | 'none' = 'none';
if (process.env.NODE_ENV === 'development') {
  sameSite = 'strict';
} else if (process.env.SAME_SITE === 'true') {
  sameSite = 'lax';
}

const TOKEN_COOKIE_MAXAGE = 86400000; // 24 hours
export const TOKEN_COOKIE_NAME = 'access-token';
export const REFRESH_COOKIE_NAME = 'refresh-token';
export const ACCESS_TOKEN_AVAILABLE_NAME = 'access-token-available';
export const AUTH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite,
  maxAge: TOKEN_COOKIE_MAXAGE / 8, // access token should last 3 hr
  domain: process.env.COOKIE_DOMAIN ?? undefined,
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
    reCaptchaToken?: string,
    reCaptchaConfigured?: boolean,
    mfaCode?: boolean,
    shouldReCaptchaBlockLogin?: boolean,
    agreedToTermsOfService?: boolean,
    ignoreTermsOfService?: boolean,
  ): Promise<SuccessDTO> {
    if (!user?.id) {
      throw new UnauthorizedException('no user found');
    }
    if (reCaptchaConfigured && !user.mfaEnabled && !mfaCode) {
      const client = new RecaptchaEnterpriseServiceClient({
        credentials: {
          private_key: process.env.GOOGLE_API_KEY.replace(/\\n/gm, '\n'),
          client_email: process.env.GOOGLE_API_EMAIL,
        },
        projectID: process.env.GOOGLE_API_ID,
      });
      const request = {
        assessment: {
          event: {
            token: reCaptchaToken,
            siteKey: process.env.RECAPTCHA_KEY,
          },
        },
        parent: client.projectPath(process.env.GOOGLE_CLOUD_PROJECT_ID),
      };
      const [response] = await client.createAssessment(request);
      client.close();
      if (!response.tokenProperties.valid && shouldReCaptchaBlockLogin) {
        throw new UnauthorizedException({
          name: 'failedReCaptchaToken',
          knownError: true,
          message: `The ReCaptcha CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`,
        });
      }
      if (response.tokenProperties.action === 'login') {
        response.riskAnalysis.reasons.forEach((reason) => {
          console.log(reason);
        });
        console.log(`The ReCaptcha score is ${response.riskAnalysis.score}`);
        const threshold = parseFloat(process.env.RECAPTCHA_THRESHOLD);
        if (
          response.riskAnalysis.score < threshold &&
          shouldReCaptchaBlockLogin
        ) {
          throw new UnauthorizedException({
            name: 'failedReCaptchaScore',
            knownError: true,
            message: `ReCaptcha failed because the score was ${response.riskAnalysis.score}`,
          });
        }
      } else {
        if (shouldReCaptchaBlockLogin)
          throw new UnauthorizedException({
            name: 'failedReCaptchaAction',
            knownError: true,
            message: `ReCaptcha failed because the action didn't match, action was: ${response.tokenProperties.action}`,
          });
      }
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
    if (
      !ignoreTermsOfService &&
      !user.agreedToTermsOfService &&
      !agreedToTermsOfService &&
      !(
        user.userRoles?.isAdmin ||
        user.userRoles?.isJurisdictionalAdmin ||
        user.userRoles?.isLimitedJurisdictionalAdmin ||
        user.userRoles?.isPartner
      )
    ) {
      throw new BadRequestException(
        `User ${user.id} has not accepted the terms of service`,
      );
    }
    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateAccessToken(user, true);
    // store access and refresh token into db
    await this.prisma.userAccounts.update({
      data: {
        activeAccessToken: accessToken,
        activeRefreshToken: newRefreshToken,
        agreedToTermsOfService:
          agreedToTermsOfService ?? agreedToTermsOfService,
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
      UserViews.full,
    );
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
    const singleUseCode = getSingleUseCode(
      Number(process.env.MFA_CODE_LENGTH),
      user.singleUseCode,
      user.singleUseCodeUpdatedAt,
      Number(process.env.MFA_CODE_VALID),
    );
    await this.prisma.userAccounts.update({
      data: {
        singleUseCode,
        singleUseCodeUpdatedAt: new Date(),
        phoneNumber: user.phoneNumber,
      },
      where: {
        id: user.id,
      },
    });
    if (dto.mfaType === MfaType.email) {
      await this.emailsService.sendMfaCode(mapTo(User, user), singleUseCode);
    } else if (dto.mfaType === MfaType.sms) {
      await this.smsService.sendMfaCode(user.phoneNumber, singleUseCode);
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
      include: { userRoles: true },
      where: { resetToken: dto.token },
    });
    if (!user) {
      throw new NotFoundException(
        `user resetToken: ${dto.token} was requested but not found`,
      );
    }
    if (
      !user.agreedToTermsOfService &&
      !dto.agreedToTermsOfService &&
      !(
        user.userRoles?.isAdmin ||
        user.userRoles?.isJurisdictionalAdmin ||
        user.userRoles?.isLimitedJurisdictionalAdmin ||
        user.userRoles?.isPartner
      )
    ) {
      throw new BadRequestException(
        `User ${user.id} has not accepted the terms of service`,
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
        confirmedAt: user.confirmedAt || new Date(),
        confirmationToken: null,
      },
      where: {
        id: user.id,
      },
    });
    return await this.setCredentials(
      res,
      mapTo(User, user),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      dto.agreedToTermsOfService,
    );
  }
  /*
    confirms a user and logs them in
  */
  async confirmUser(dto: Confirm, res?: Response): Promise<SuccessDTO> {
    const token = verify(dto.token, process.env.APP_SECRET) as IdAndEmail;
    let user = await this.userService.findUserOrError({ userId: token.id });
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
    return await this.setCredentials(
      res,
      mapTo(User, user),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
    );
  }
  /*
    confirms a user if using pwdless
  */
  async confirmAndSetCredentials(
    user: User,
    res: Response,
    agreedToTermsOfService?: boolean,
  ): Promise<SuccessDTO> {
    if (!user.confirmedAt) {
      const data: Prisma.UserAccountsUpdateInput = {
        confirmedAt: new Date(),
        confirmationToken: null,
      };
      await this.prisma.userAccounts.update({
        data,
        where: {
          id: user.id,
        },
      });
    }
    return await this.setCredentials(
      res,
      user,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      agreedToTermsOfService,
    );
  }
}
