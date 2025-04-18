import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/schemas/product.schema';
import { CreateProductDto } from './dtos/create-product.dto';
import { throwException } from 'src/utils/exception.util';
import { SearchProductDto } from './dtos/search-products.dto';
import { cleanObject } from 'src/utils/object.util';
import { UpdateProductDto } from './dtos/update-product.dto';
import { IUserInterface } from 'src/interfaces/users.interface';

const className = 'ProductsService';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(className);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: IUserInterface,
  ): Promise<Product> {
    const methodName = 'createProduct';
    this.logger.log(
      methodName,
      'createProductDto:',
      createProductDto,
      'user:',
      user,
    );

    const { name } = createProductDto;

    try {
      const product = await this.productModel
        .findOne({
          name,
          deletedAt: null,
        })
        .exec();
      if (product)
        throw new BadRequestException(
          `product with name: ${name} already in use`,
        );

      return await this.productModel.create({
        ...createProductDto,
        currentStock: 0,
        price: 0,
        totalSales: 0,
        createdBy: new Types.ObjectId(user.id),
        updatedBy: new Types.ObjectId(user.id),
        deletedBy: null,
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

  async searchProducts(args: SearchProductDto): Promise<Product[]> {
    const methodName = 'searchProducts';
    this.logger.log(methodName, 'args:', args);

    try {
      const cleanedObject = cleanObject(args);
      const filterObject = { ...cleanedObject, deletedAt: null };

      return await this.productModel.find(filterObject).exec();
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async updateProductById(
    id: string,
    updateProductDto: UpdateProductDto,
    user: IUserInterface,
  ): Promise<Product> {
    const methodName = 'updateProductById';
    this.logger.log(
      methodName,
      'id:',
      id,
      'updateProductDto:',
      updateProductDto,
      'user:',
      user,
    );

    try {
      const findById = await this.productModel.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!findById) throw new NotFoundException(`product id: ${id} not found`);

      const cleanedObject = cleanObject(updateProductDto);
      if (!Object.values(cleanedObject).length)
        throw new BadRequestException(
          `updateProduct detail not found: ${JSON.stringify(updateProductDto)}`,
        );

      if (cleanedObject.name)
        if (cleanedObject.name !== findById.name) {
          const findByName = await this.productModel.findOne({
            name: cleanedObject.name,
            deletedAt: null,
          });
          if (findByName)
            throw new BadRequestException(
              `product with name: ${cleanedObject.name} already in use`,
            );
        }

      const updateObject: Partial<Product> = {
        ...cleanedObject,
        updatedBy: new Types.ObjectId(user.id),
        updatedAt: new Date(),
      };

      return (await this.productModel
        .findOneAndUpdate({ _id: id }, updateObject, { new: true })
        .exec()) as Product;
    } catch (err) {
      throwException({
        className,
        methodName,
        err,
      });
      throw err;
    }
  }

  async deleteProductById(id: string, user: IUserInterface): Promise<Product> {
    const methodName = 'deleteProductById';
    this.logger.log(methodName, 'id:', id, 'user:', user);

    try {
      const product = await this.productModel.findOne({
        _id: id,
        deletedAt: null,
      });
      if (!product)
        throw new NotFoundException(`product with id: ${id} not found`);

      return (await this.productModel
        .findOneAndUpdate(
          { _id: id },
          { deletedBy: new Types.ObjectId(user.id), deletedAt: new Date() },
          { new: true },
        )
        .exec()) as Product;
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
