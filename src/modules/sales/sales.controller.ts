import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { SalesService } from './sales.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IUserInterface } from 'src/interfaces/users.interface';
import { IApiResponse } from 'src/interfaces/api.interface';
import { SaleDto } from './dtos/create-sale.dto';
import { Sales } from 'src/schemas/sales.schema';
import { SearchSaleDto } from './dtos/search-sale-dto';

@UseGuards(AccessTokenGuard)
@Controller('sales')
export class SalesController {
  private readonly logger = new Logger('SalesController');

  constructor(private readonly salesService: SalesService) {}

  @Post()
  async sale(
    @Body() body: SaleDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<IApiResponse<Sales>> {
    this.logger.log('sale body:', body, 'user:', user);
    const response = await this.salesService.sale(body, user);
    this.logger.log('sale response:', response);
    return { data: response };
  }

  @Get()
  async getSaleHistories(
    @Query() query: SearchSaleDto,
  ): Promise<IApiResponse<Sales[]>> {
    this.logger.log('getSaleHistories query:', query);
    const response = await this.salesService.getSaleHistories(query);
    this.logger.log('getSaleHistories response: ', response);
    return { data: response };
  }
}
