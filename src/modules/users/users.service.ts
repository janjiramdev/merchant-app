import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserWithId } from 'src/schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { throwException } from 'src/utils/exception.util';
import * as bcrypt from 'bcrypt';
import { SearchUsersDto } from './dtos/search-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

const className = 'UsersService';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const methodName = 'createUser';
    this.logger.log(methodName, 'createUserDto:', createUserDto);

    const { username, password, firstname, lastname, age, role } =
      createUserDto;

    try {
      const user = await this.userModel.findOne({ username, deletedAt: null });
      if (user)
        throw new BadRequestException(
          `user with username: ${username} already in use`,
        );

      const hashedPassword: string = await bcrypt.hash(password, 10);

      return await this.userModel.create({
        username,
        password: hashedPassword,
        firstname,
        lastname,
        age,
        role,
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

  async searchUsers(args: SearchUsersDto): Promise<User[]> {
    const methodName = 'searchUsers';
    this.logger.log(methodName, 'args:', args);

    const { username, firstname, lastname, age, role } = args;

    try {
      let filterObject = {};
      if (username) filterObject = { ...filterObject, username };
      if (firstname) filterObject = { ...filterObject, firstname };
      if (lastname) filterObject = { ...filterObject, lastname };
      if (age) filterObject = { ...filterObject, age };
      if (role) filterObject = { ...filterObject, role };
      filterObject = { ...filterObject, deletedAt: null };

      return await this.userModel.find(filterObject).populate('role').exec();
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async updateUserById(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const methodName = 'updateUserById';
    this.logger.log(methodName, 'id:', id, 'updateUserDto:', updateUserDto);

    const { password, firstname, lastname, age, role } = updateUserDto;

    try {
      const findById = await this.userModel.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!findById) throw new NotFoundException(`user id: ${id} not found`);

      if (!password && !firstname && !lastname && !age && !role)
        throw new BadRequestException(
          `updateUser detail not found: ${JSON.stringify(updateUserDto)}`,
        );

      const updateObject: Partial<UpdateUserDto> = {};
      if (password) updateObject.password = await bcrypt.hash(password, 10);
      if (firstname) updateObject.firstname = firstname;
      if (lastname) updateObject.lastname = lastname;
      if (age) updateObject.age = age;
      if (role) updateObject.role = role;

      return (await this.userModel
        .findOneAndUpdate({ _id: id }, updateObject, { new: true })
        .exec()) as User;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async deleteUserById(id: string): Promise<User> {
    const methodName = 'deleteUserById';
    this.logger.log(methodName, 'id:', id);

    try {
      const user = await this.userModel.findOne({ _id: id, deletedAt: null });
      if (!user) throw new NotFoundException(`user with id: ${id} not found`);

      return (await this.userModel
        .findOneAndUpdate({ _id: id }, { deletedAt: new Date() }, { new: true })
        .exec()) as User;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async getValidateUser(username: string): Promise<UserWithId | null> {
    this.logger.log(`getValidateUser username: ${username}`);
    return await this.userModel
      .findOne({ username }, { _id: true, username: true, password: true })
      .exec();
  }
}
