import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ITokens } from 'src/interfaces/auth.interface';
import { LoginDto } from './dtos/login.dto';
import { IApiResponse } from 'src/interfaces/api.interface';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IUserInterface } from 'src/interfaces/users.interface';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<IApiResponse<ITokens>> {
    this.logger.log('login body:', body);
    const response = await this.authService.login(body);
    this.logger.log('login response:', response);
    return { data: response };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(
    @CurrentUser() user: IUserInterface,
  ): Promise<IApiResponse<ITokens>> {
    this.logger.log('refreshToken user:', user);
    const response = await this.authService.refreshToken(user);
    this.logger.log('refreshToken response:', response);
    return { data: response };
  }
}
