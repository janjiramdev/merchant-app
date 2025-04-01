import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from 'src/schemas/roles.schema';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }
}
