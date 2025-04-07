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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/schemas/roles.schema';
import { IApiResponse } from 'src/interfaces/api.interface';
import { SearchRolesDto } from './dtos/search-roles.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

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
    this.logger.log('searchRoles', ' query:', query);
    const response = await this.rolesService.searchRoles(query);
    this.logger.log('searchRoles response: ', response);
    return { data: response };
  }

  @Patch(':id')
  async updateRoleById(
    @Param('id') paramId: string,
    @Body() body: UpdateRoleDto,
  ): Promise<IApiResponse<Role>> {
    this.logger.log('updateRoleById paramId:', paramId, 'body:', body);

    const response = await this.rolesService.updateRoleById(body, paramId);
    this.logger.log('updateRoleById response:', response);
    return { data: response };
  }

  @Delete(':id')
  async deleteRoleById(
    @Param('id') paramId: string,
  ): Promise<IApiResponse<Role>> {
    this.logger.log('deleteRoleById paramId:', paramId);
    const response = await this.rolesService.deleteRoleById(paramId);
    this.logger.log('deleteRoleById response:', response);
    return { data: response };
  }
}
