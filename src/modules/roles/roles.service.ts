import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/schemas/roles.schema';
import { throwException } from 'src/utils/exception.util';
import { SearchRolesDto } from './dtos/search-roles.dto';

const className = 'RolesService';

@Injectable()
export class RolesService {
  private logger = new Logger('RolesService');

  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

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
}
