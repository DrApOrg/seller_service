import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() product: Product, @UploadedFile() file: Express.Multer.File) {
    return this.productService.create(product, file);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() product: Product,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.update(id, product, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Get('/bySupplier/:supplier')
  async getProductsBySupplier(
    @Param('supplier') supplier: string,
  ): Promise<Product[]> {
    try {
      const products = await this.productService.findBySupplier(supplier);
      return products;
    } catch (error) {
      // Manejar el error según sea necesario
      throw new Error(
        `Error al obtener productos por proveedor: ${error.message}`,
      );
    }
  }
}
