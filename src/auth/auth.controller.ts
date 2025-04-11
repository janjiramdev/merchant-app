import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ITokens } from 'src/interfaces/auth.interface';
import { LoginDto } from './dtos/login.dto';
import { IApiResponse } from 'src/interfaces/api.interface';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<IApiResponse<ITokens>> {
    this.logger.log('login body:', body);
    const response = await this.authService.login(body);
    this.logger.log('login response:', response);
    return { data: response };
  }
}
