import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetAllProductsDto } from './dto/get-all.product.dto';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductsDto) {
    return this.productService.getAll(queryDto);
  }

  @Get('similar/:id')
  async getSimilar(@Param('id') id: string) {
    return this.productService.getSimilar(+id);
  }

  @Get('by-slug/:slug')
  async getProductBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.byCategory(categorySlug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createProdut() {
    return this.productService.create();
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':id')
  async updateProdut(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(+id, dto);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete(+id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.productService.byId(+id);
  }
}
