import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from 'src/schemas/role.schema';
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
      const role = await this.roleModel.findOne({ name, deletedAt: null });
      if (role)
        throw new BadRequestException(`role with name: ${name} already in use`);

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
      let filterObject = {};
      if (name) filterObject = { ...filterObject, name };
      if (userCount !== undefined)
        filterObject = { ...filterObject, userCount };
      filterObject = { ...filterObject, deletedAt: null };

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

    const { name, userCount } = updateRoleDto;

    try {
      if (!name && userCount === undefined)
        throw new BadRequestException(
          `updateRole detail not found: ${JSON.stringify(updateRoleDto)}`,
        );

      const findById = await this.roleModel.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!findById) throw new NotFoundException(`role id: ${id} not found`);

      let updateObject = {};
      if (name) {
        if (name !== findById.name) {
          const findByName = await this.roleModel.findOne({
            name,
            deletedAt: null,
          });
          if (findByName)
            throw new BadRequestException(
              `role with name: ${name} already in use`,
            );
          else updateObject = { name };
        } else updateObject = { name };
      }
      if (userCount !== undefined)
        updateObject = { ...updateObject, userCount };

      return (await this.roleModel
        .findByIdAndUpdate(new Types.ObjectId(id), updateObject, {
          new: true,
        })
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
      const role = await this.roleModel.findOne({ _id: id, deletedAt: null });
      if (!role) throw new NotFoundException(`role id: ${id} not found`);

      return (await this.roleModel
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { deletedAt: new Date() },
          { new: true },
        )
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
}
