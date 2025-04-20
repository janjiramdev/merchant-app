import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { throwException } from 'src/utils/exception.util';
import { SearchUsersDto } from './dtos/search-users.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  IUpdateUserRefreshToken,
  IUserInterface,
} from 'src/interfaces/users.interface';
import { hashData } from 'src/utils/crypto.util';
import { cleanObject } from 'src/utils/object.util';
import { ECleanObjectType } from 'src/enums/utils.enum';

const className = 'UsersService';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(className);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const methodName = 'createUser';
    this.logger.log(methodName, 'createUserDto:', createUserDto);

    const { username, password } = createUserDto;

    try {
      const user = await this.userModel.findOne({ username, deletedAt: null });
      if (user)
        throw new BadRequestException(
          `user with username: ${username} already in use`,
        );

      return await this.userModel
        .create({
          ...createUserDto,
          password: await hashData(password),
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        })
        .then((result) => {
          const formattedResult = result.toObject() as Record<string, any>;
          delete formattedResult.password;
          return formattedResult as User;
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

    try {
      const cleanedObject = cleanObject<SearchUsersDto>({
        obj: args,
        objectType: ECleanObjectType.SEARCH,
      });
      const filterObject = { ...cleanedObject, deletedAt: null };

      return await this.userModel.find(filterObject).exec();
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
    user: IUserInterface,
  ): Promise<User> {
    const methodName = 'updateUserById';
    this.logger.log(
      methodName,
      'id:',
      id,
      'updateUserDto:',
      updateUserDto,
      'user:',
      user,
    );

    try {
      if (id !== user.id)
        throw new ForbiddenException(
          'you are not allowed to update this product',
        );

      const findById = await this.userModel.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!findById) throw new NotFoundException(`user id: ${id} not found`);

      const cleanedObject = cleanObject<UpdateUserDto>({
        obj: updateUserDto,
        objectType: ECleanObjectType.OTHERS,
      });
      if (!Object.values(cleanedObject).length)
        throw new BadRequestException(
          `updateUser detail not found: ${JSON.stringify(updateUserDto)}`,
        );

      const updateObject = { ...cleanedObject, updatedAt: new Date() };
      if (cleanedObject.password)
        updateObject.password = await hashData(cleanedObject.password);

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

  async deleteUserById(id: string, user: IUserInterface): Promise<User> {
    const methodName = 'deleteUserById';
    this.logger.log(methodName, 'id:', id, 'user:', user);

    try {
      if (id !== user.id)
        throw new ForbiddenException(
          'you are not allowed to update this product',
        );

      const findById = await this.userModel.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!findById)
        throw new NotFoundException(`user with id: ${id} not found`);

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

  async getValidateUser(username: string): Promise<UserDocument | null> {
    const methodName = 'getValidateUser';
    this.logger.log(methodName, 'username:', username);

    try {
      return await this.userModel
        .findOne(
          { username, deletedAt: null },
          { _id: true, username: true, password: true, refreshToken: true },
        )
        .exec();
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async updateUserRefreshToken(args: IUpdateUserRefreshToken): Promise<void> {
    const methodName = 'updateUserRefreshToken';
    this.logger.log(methodName, 'args:', args);

    const { id, refreshToken } = args;

    try {
      await this.userModel.findOneAndUpdate(
        { _id: id },
        { refreshToken: await hashData(refreshToken), updatedAt: new Date() },
      );
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
