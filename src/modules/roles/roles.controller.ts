import { Controller, Get, Logger, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/schemas/roles.schema';
import { IApiResponse } from 'src/interfaces/api.interface';
import { SearchRolesDto } from './dtos/search-roles.dto';

@Controller('roles')
export class RolesController {
  private logger = new Logger('RolesController');
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async searchRoles(
    @Query() query: SearchRolesDto,
  ): Promise<IApiResponse<Role[]>> {
    this.logger.log('searchRoles', ' query:', query);
    const response = await this.rolesService.searchRoles(query);
    this.logger.log('searchRoles response: ', response);
    return { data: response };
  }
}
