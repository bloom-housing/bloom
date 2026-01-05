import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../dtos/users/user.dto';
import { TOKEN_COOKIE_NAME } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';
import { mapTo } from '../utilities/mapTo';

type PayloadType = {
  sub: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: JwtStrategy.extractJwt,
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: process.env.APP_SECRET,
    });
  }

  /*
    verifies that the incoming jwt token is valid
    returns the verified user
  */
  async validate(req: Request, payload: PayloadType): Promise<User> {
    const rawToken = JwtStrategy.extractJwt(req);
    const userId = payload.sub;

    const rawUser = await this.prisma.userAccounts.findFirst({
      include: {
        listings: true,
        userRoles: true,
        jurisdictions: {
          include: {
            featureFlags: {
              select: {
                name: true,
                active: true,
              },
            },
          },
        },
      },
      where: {
        id: userId,
      },
    });

    if (!rawUser) {
      // if there is no user matching the incoming id
      throw new UnauthorizedException(`user ${userId} does not exist`);
    }
    if (rawUser.activeAccessToken !== rawToken) {
      // if the incoming token is not the active token for the user, clear the user's tokens
      await this.prisma.userAccounts.update({
        data: {
          activeAccessToken: null,
          activeRefreshToken: null,
        },
        where: {
          id: userId,
        },
      });
      throw new UnauthorizedException(`
        user ${userId} attempted to log in, but token ${rawToken} didn't match their stored token ${rawUser.activeAccessToken}
      `);
    }

    const user = mapTo(User, rawUser);
    return user;
  }

  /*
    grabs the token out the request's cookies
  */
  static extractJwt(req: Request): string | null {
    if (req.cookies?.[TOKEN_COOKIE_NAME]) {
      return req.cookies[TOKEN_COOKIE_NAME];
    }

    return null;
  }
}
