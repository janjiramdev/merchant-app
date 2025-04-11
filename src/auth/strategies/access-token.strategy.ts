import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserInterface } from 'src/interfaces/users.interface';
import { IAccessTokenValidateInput } from 'src/interfaces/auth.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  validate(payload: IAccessTokenValidateInput): IUserInterface {
    return { _id: payload.sub, username: payload.username };
  }
}
