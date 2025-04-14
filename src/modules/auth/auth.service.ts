import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { IGenerateTokensInput, ITokens } from 'src/interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { UserWithId } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { IUserInterface } from 'src/interfaces/users.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(args: LoginDto): Promise<UserWithId> {
    this.logger.log('validateUser args:', args);

    const { username, password } = args;

    const user = await this.usersService.getValidateUser(username);
    if (!user)
      throw new NotFoundException(`user with username: ${username} not found`);
    const comparedPassword = await compare(password, user.password);
    if (!comparedPassword) throw new BadRequestException('invalid password');

    return user;
  }

  async generateTokens(args: IGenerateTokensInput): Promise<ITokens> {
    this.logger.log('generateTokens args:', args);

    const { _id, username } = args;

    const accessToken = await this.jwtService.signAsync(
      { sub: _id, username },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRE_TIME',
        ),
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: _id, username },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRE_TIME',
        ),
      },
    );

    return { accessToken, refreshToken };
  }

  async login(args: LoginDto): Promise<ITokens> {
    this.logger.log('login args:', args);

    const validatedUser = await this.validateUser(args);
    const tokens = await this.generateTokens({
      _id: validatedUser._id.toString(),
      username: validatedUser.username,
    });
    await this.usersService.updateUserRefreshToken({
      _id: validatedUser._id.toString(),
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  }

  async refreshToken(args: IUserInterface): Promise<ITokens> {
    this.logger.log('refreshToken args:', args);

    const { _id, username } = args;
    const tokens = await this.generateTokens({
      _id,
      username,
    });
    await this.usersService.updateUserRefreshToken({
      _id,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }
}
