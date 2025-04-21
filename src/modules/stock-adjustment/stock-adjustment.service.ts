import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserInterface } from 'src/interfaces/users.interface';
import { StockAdjustment } from 'src/schemas/stock-adjustment.schema';
import { throwException } from 'src/utils/exception.util';
import { ProductsService } from '../products/products.service';
import { AdjustStockDto } from './dtos/create-stock-adjust.dto';
import { EStockAdjustType } from 'src/enums/stock-adjustment.enum';
import { SearchStockAdjustDto } from './dtos/search-stock-adjust.dto';

const className = 'StockAdjustmentService ';

@Injectable()
export class StockAdjustmentService {
  private readonly logger = new Logger(className);

  constructor(
    @InjectModel(StockAdjustment.name)
    private readonly stockAdjustmentModel: Model<StockAdjustment>,
    private readonly productsService: ProductsService,
  ) {}

  async adjustStock(
    adjustStockDto: AdjustStockDto,
    user: IUserInterface,
  ): Promise<StockAdjustment> {
    const methodName = 'addjustStock';
    this.logger.log(
      methodName,
      'adjustStockDto:',
      adjustStockDto,
      'user:',
      user,
    );

    const { productId, adjustType, quantity } = adjustStockDto;

    try {
      const product = await this.productsService.getProductById(
        productId,
        user,
      );
      let newStock = product.currentStock ?? 0;

      if (adjustType === EStockAdjustType.ADD) newStock += quantity;
      else if (adjustType === EStockAdjustType.REMOVE) newStock -= quantity;

      if (newStock < 0)
        throw new BadRequestException(
          `unable to adjust stock: ${product.currentStock ?? 0}`,
        );
      await this.productsService.updateProductById(
        product._id.toString(),
        { currentStock: newStock },
        user,
      );

      return await this.stockAdjustmentModel.create({
        product: product._id,
        quantity,
        adjustType,
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

  async getStockAdjustHistories(
    args: SearchStockAdjustDto,
  ): Promise<StockAdjustment[]> {
    const methodName = 'getStockAdjustHistories';
    this.logger.log(methodName, 'args:', args);

    const { productId, adjustType, quantity } = args;

    try {
      let filterObject = {};
      if (productId) filterObject = { product: new Types.ObjectId(productId) };
      if (adjustType) filterObject = { ...filterObject, adjustType };
      if (quantity !== undefined) filterObject = { ...filterObject, quantity };

      return await this.stockAdjustmentModel.find(filterObject).exec();
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
