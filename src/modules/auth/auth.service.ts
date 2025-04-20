import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { ITokens } from 'src/interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { IUserInterface } from 'src/interfaces/users.interface';
import { throwException } from 'src/utils/exception.util';

const className = 'AuthService';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(className);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async validateUser(args: LoginDto): Promise<UserDocument> {
    const methodName = 'validateUser';
    this.logger.log(methodName, 'args:', args);

    const { username, password } = args;

    try {
      const user = await this.usersService.getValidateUser(username);
      if (!user)
        throw new NotFoundException(
          `user with username: ${username} not found`,
        );

      const comparedPassword = await compare(password, user.password);
      if (!comparedPassword) throw new BadRequestException('invalid password');

      return user;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  private async generateTokens(args: IUserInterface): Promise<ITokens> {
    const methodName = 'generateTokens';
    this.logger.log(methodName, 'args:', args);

    const { id, username } = args;

    try {
      const accessToken = await this.jwtService.signAsync(
        { sub: id, username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRE_TIME',
          ),
        },
      );
      const refreshToken = await this.jwtService.signAsync(
        { sub: id, username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRE_TIME',
          ),
        },
      );

      return { accessToken, refreshToken };
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async login(args: LoginDto): Promise<ITokens> {
    const methodName = 'login';
    this.logger.log(methodName, 'args:', args);

    try {
      const validatedUser = await this.validateUser(args);
      const tokens = await this.generateTokens({
        id: validatedUser._id.toString(),
        username: validatedUser.username,
      });
      await this.usersService.updateUserRefreshToken({
        id: validatedUser._id.toString(),
        refreshToken: tokens.refreshToken,
      });

      return tokens;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async refreshToken(args: IUserInterface): Promise<ITokens> {
    const methodName = 'refreshToken';
    this.logger.log(methodName, 'args:', args);

    const { id, username } = args;

    try {
      const tokens = await this.generateTokens({
        id,
        username,
      });
      await this.usersService.updateUserRefreshToken({
        id,
        refreshToken: tokens.refreshToken,
      });

      return tokens;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }
}
