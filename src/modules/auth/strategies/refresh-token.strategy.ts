import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ITokenValidateInput } from 'src/interfaces/auth.interface';
import { compareData } from 'src/utils/crypto.util';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_REFRESH_TOKEN_SECRET',
      ) as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: ITokenValidateInput) {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim();
    if (!refreshToken) throw new UnauthorizedException('refresh token missing');

    const user = await this.usersService.getValidateUser(payload.username);
    const comparedToken = compareData(refreshToken, user?.refreshToken ?? '');
    if (!user || !user.refreshToken || !comparedToken)
      throw new ForbiddenException('access denied');

    return { id: payload.sub, username: payload.username };
  }
}
