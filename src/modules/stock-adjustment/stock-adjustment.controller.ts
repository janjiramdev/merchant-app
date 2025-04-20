import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IApiResponse } from 'src/interfaces/api.interface';
import { StockAdjustment } from 'src/schemas/stock-adjustment.schema';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IUserInterface } from 'src/interfaces/users.interface';
import { AdjustStockDto } from './dtos/create-stock-adjust.dto';
import { StockAdjustmentService } from './stock-adjustment.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { SearchStockAdjustDto } from './dtos/search-stock-adjust.dto';

@UseGuards(AccessTokenGuard)
@Controller('stock-adjustment')
export class StockAdjustmentController {
  private readonly logger = new Logger('StockAdjustmentController');

  constructor(
    private readonly stockAdjustmentService: StockAdjustmentService,
  ) {}

  @Post()
  async adjustStock(
    @Body() body: AdjustStockDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<IApiResponse<StockAdjustment>> {
    this.logger.log('adjustStock body:', body, 'user:', user);
    const response = await this.stockAdjustmentService.adjustStock(body, user);
    this.logger.log('adjustStock response:', response);
    return { data: response };
  }

  @Get()
  async getStockAdjustHistories(
    @Query() query: SearchStockAdjustDto,
  ): Promise<IApiResponse<StockAdjustment[]>> {
    this.logger.log('getStockAdjustHistories query:', query);
    const response =
      await this.stockAdjustmentService.getStockAdjustHistories(query);
    this.logger.log('getStockAdjustHistories response: ', response);
    return { data: response };
  }
}
