import { Controller, Get, Logger } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/schemas/roles.schema';
import { IApiResponse } from 'src/interfaces/api.interface';

@Controller('roles')
export class RolesController {
  private logger = new Logger('RolesController');
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<IApiResponse<Role[]>> {
    this.logger.log(`getRoles`);
    const response = await this.rolesService.findAll();
    this.logger.log(`getRoles response: ${JSON.stringify(response)}`);
    return { data: response };
  }
}
