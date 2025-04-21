import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sales } from 'src/schemas/sales.schema';
import { SaleDto } from './dtos/create-sale.dto';
import { IUserInterface } from 'src/interfaces/users.interface';
import { ProductsService } from '../products/products.service';
import { throwException } from 'src/utils/exception.util';
import { SearchSaleDto } from './dtos/search-sale-dto';

const className = 'SalesService ';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(className);

  constructor(
    @InjectModel(Sales.name)
    private readonly salesModel: Model<Sales>,
    private readonly productsService: ProductsService,
  ) {}

  async sale(saleDto: SaleDto, user: IUserInterface): Promise<Sales> {
    const methodName = 'sale';
    this.logger.log(methodName, 'saleDto:', saleDto, 'user:', user);

    const { quantity } = saleDto;

    try {
      const product = await this.productsService.getProductById(
        saleDto.productId,
        user,
      );

      const newStock = (product.currentStock ?? 0) - quantity;
      if (newStock < 0)
        throw new BadRequestException(
          `unable to adjust stock: ${product.currentStock ?? 0}, quantity: ${quantity}`,
        );

      const totalPrice = product.price * quantity;

      await this.productsService.updateProductById(
        product._id.toString(),
        { totalSales: product.totalSales + totalPrice, currentStock: newStock },
        user,
      );

      return await this.salesModel.create({
        productId: product._id,
        quantity: saleDto.quantity,
        totalPrice,
        createdBy: new Types.ObjectId(user.id),
        createdAt: new Date(),
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

  async getSaleHistories(args: SearchSaleDto): Promise<Sales[]> {
    const methodName = 'getSaleHistories';
    this.logger.log(methodName, 'args:', args);

    const { productId, quantity, totalPrice } = args;

    try {
      let filterObject = {};
      if (productId)
        filterObject = { productId: new Types.ObjectId(productId) };
      if (quantity !== undefined) filterObject = { ...filterObject, quantity };
      if (totalPrice !== undefined)
        filterObject = { ...filterObject, totalPrice };

      return await this.salesModel.find(filterObject).exec();
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
