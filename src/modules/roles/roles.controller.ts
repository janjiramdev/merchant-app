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
import { RolesService } from './roles.service';
import { Role } from 'src/schemas/role.schema';
import { IApiResponse } from 'src/interfaces/api.interface';
import { SearchRolesDto } from './dtos/search-roles.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('roles')
export class RolesController {
  private logger = new Logger('RolesController');
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async createRole(@Body() body: CreateRoleDto): Promise<IApiResponse<Role>> {
    this.logger.log('createRole body:', body);
    const response = await this.rolesService.createRole(body);
    this.logger.log('createRole response:', response);
    return { data: response };
  }

  @Get()
  async searchRoles(
    @Query() query: SearchRolesDto,
  ): Promise<IApiResponse<Role[]>> {
    this.logger.log('searchRoles query:', query);
    const response = await this.rolesService.searchRoles(query);
    this.logger.log('searchRoles response: ', response);
    return { data: response };
  }

  @Patch(':id')
  async updateRoleById(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ): Promise<IApiResponse<Role>> {
    this.logger.log('updateRoleById id:', id, 'body:', body);
    const response = await this.rolesService.updateRoleById(id, body);
    this.logger.log('updateRoleById response:', response);
    return { data: response };
  }

  @Delete(':id')
  async deleteRoleById(@Param('id') id: string): Promise<IApiResponse<Role>> {
    this.logger.log('deleteRoleById id:', id);
    const response = await this.rolesService.deleteRoleById(id);
    this.logger.log('deleteRoleById response:', response);
    return { data: response };
  }
}
