import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/schemas/roles.schema';
import { throwException } from 'src/utils/exception.util';

const className = 'RolesService';

@Injectable()
export class RolesService {
  private logger = new Logger('RolesService');

  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async findAll(): Promise<Role[]> {
    const methodName = 'getRoles';
    this.logger.log(`${methodName}`);

    try {
      return await this.roleModel.find().exec();
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
