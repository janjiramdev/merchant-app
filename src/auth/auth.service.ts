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
import { UserWithId } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(args: LoginDto): Promise<UserWithId> {
    this.logger.log('validateUser args:', args);

    const { username, password } = args;

    const user = await this.usersService.getValidateUser(username);
    if (!user)
      throw new NotFoundException(`user with username: ${username} not found`);
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) throw new BadRequestException(`invalid password`);

    return user;
  }

  async login(args: LoginDto): Promise<ITokens> {
    this.logger.log('login args:', args);
    const user = await this.validateUser(args);
    const payload = { sub: user._id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
