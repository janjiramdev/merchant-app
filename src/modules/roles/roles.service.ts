import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/schemas/roles.schema';
import { throwException } from 'src/utils/exception.util';
import { SearchRolesDto } from './dtos/search-roles.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

const className = 'RolesService';

@Injectable()
export class RolesService {
  private logger = new Logger('RolesService');

  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const methodName = 'createRole';
    this.logger.log(methodName, 'createRoleDto:', createRoleDto);

    const { name } = createRoleDto;

    try {
      const role = await this.roleModel.findOne({ name });
      if (role)
        throw new BadRequestException(`role name: ${name} already in use`);

      return await this.roleModel.create({
        name,
        userCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async searchRoles(args: SearchRolesDto): Promise<Role[]> {
    const methodName = 'searchRoles';
    this.logger.log(methodName, ' args:', args);

    const { name, userCount } = args;

    try {
      let filterObject: SearchRolesDto = {};
      if (name) filterObject = { ...filterObject, name };
      if (userCount !== undefined)
        filterObject = { ...filterObject, userCount };

      return await this.roleModel.find(filterObject).exec();
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async updateRoleById(
    updateRoleDto: UpdateRoleDto,
    id: string,
  ): Promise<Role> {
    const methodName = 'updateRoleById';
    this.logger.log(methodName, 'updateRoleDto:', updateRoleDto, 'id:', id);

    const { name } = updateRoleDto;

    try {
      if (!name)
        throw new BadRequestException(
          `updateRole detail not found: ${JSON.stringify(updateRoleDto)}`,
        );

      const role = await this.roleModel.findById(id);
      if (!role) throw new NotFoundException(`role id: ${id} not found`);

      return (await this.roleModel
        .findByIdAndUpdate(id, updateRoleDto, { new: true })
        .exec()) as Role;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async deleteRoleById(id: string): Promise<Role> {
    const methodName = 'deleteRoleById';
    this.logger.log(methodName, 'id:', id);

    try {
      const role = await this.searchRoles({});
      if (!role) throw new NotFoundException('role not found');

      const response = await this.roleModel
        .findByIdAndDelete(id, { new: true })
        .exec();

      return response as Role;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }
}
