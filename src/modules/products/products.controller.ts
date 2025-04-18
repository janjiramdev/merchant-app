import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { Product } from 'src/schemas/product.schema';
import { IApiResponse } from 'src/interfaces/api.interface';
import { SearchProductDto } from './dtos/search-products.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { IUserInterface } from 'src/interfaces/users.interface';

@UseGuards(AccessTokenGuard)
@Controller('products')
export class ProductsController {
  private readonly logger = new Logger('ProductsController');

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() body: CreateProductDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<IApiResponse<Product>> {
    this.logger.log('createProduct body:', body, 'user:', user);
    const response = await this.productsService.createProduct(body, user);
    this.logger.log('createProduct response:', response);
    return { data: response };
  }

  @Get()
  async searchProducts(
    @Query() query: SearchProductDto,
  ): Promise<IApiResponse<Product[]>> {
    this.logger.log('searchProducts query:', query);
    const response = await this.productsService.searchProducts(query);
    this.logger.log('searchProducts response: ', response);
    return { data: response };
  }

  @Patch(':id')
  async updateProductById(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @CurrentUser() user: IUserInterface,
  ): Promise<IApiResponse<Product>> {
    this.logger.log('updateProductById id:', id, 'body:', body, 'user:', user);
    const response = await this.productsService.updateProductById(
      id,
      body,
      user,
    );
    this.logger.log('updateProductById response:', response);
    return { data: response };
  }

  @Delete(':id')
  async deleteProductById(
    @Param('id') id: string,
    @CurrentUser() user: IUserInterface,
  ): Promise<IApiResponse<Product>> {
    this.logger.log('deleteProductById id:', id, 'user:', user);
    const response = await this.productsService.deleteProductById(id, user);
    this.logger.log('deleteProductById response:', response);
    return { data: response };
  }
}
