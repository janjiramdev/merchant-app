import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { IApiResponse } from 'src/interfaces/api.interface';
import { SearchUsersDto } from './dtos/search-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('users')
export class UsersController {
  private logger = new Logger('UsersController');
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<IApiResponse<User>> {
    this.logger.log('createUser body:', body);
    const response = await this.usersService.createUser(body);
    this.logger.log('createUser response:', response);
    return { data: response };
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async searchUsers(
    @Query() query: SearchUsersDto,
  ): Promise<IApiResponse<User[]>> {
    this.logger.log('searchUsers query:', query);
    const response = await this.usersService.searchUsers(query);
    this.logger.log('searchUsers response: ', response);
    return { data: response };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<IApiResponse<User>> {
    this.logger.log('updateUserById id:', id, 'body:', body);
    const response = await this.usersService.updateUserById(id, body);
    this.logger.log('updateUserById response:', response);
    return { data: response };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<IApiResponse<User>> {
    this.logger.log('deleteUserById id:', id);
    const response = await this.usersService.deleteUserById(id);
    this.logger.log('deleteUserById response:', response);
    return { data: response };
  }
}
