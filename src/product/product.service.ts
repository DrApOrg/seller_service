import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Model } from 'mongoose';
import { s3Service } from 'src/util/s3';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly appService: s3Service,
  ) {}
  async create(product: Product, file): Promise<Product> {
    try {
      const create = new this.productModel(product);
      if (file) {
        const image = await this.appService.uploadFile(file);
        if (image) {
          create.image = {
            location: image.Location,
            key: image.Key,
          };
        } else {
          throw new Error('Error al cargar la imagen');
        }
      }

      return await create.save();
    } catch (error) {
      throw new Error(`No se pudo crear el producto: ${error.message}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      throw new Error(
        `No se pudieron obtener todos los productos: ${error.message}`,
      );
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new Error('El producto no se encontró');
      }
      return product;
    } catch (error) {
      throw new Error(`Error al encontrar el producto: ${error.message}`);
    }
  }

  async update(id: string, product: Product, file): Promise<Product> {
    if (file) {
      const productDelete = await this.productModel.findById(id).exec();
      this.appService.deleteFile(productDelete.image.key);
      const image = await this.appService.uploadFile(file);
      if (image) {
        product.image = {
          location: image.Location,
          key: image.Key,
        };
      } else {
        throw new Error('Error al cargar la imagen');
      }
    }
    try {
      return await this.productModel
        .findByIdAndUpdate(id, product, { new: true })
        .exec();
    } catch (error) {
      throw new Error(`No se pudo actualizar el producto: ${error.message}`);
    }
  }

  async remove(id: string): Promise<any> {
    const storyDelete = await this.productModel.findById(id).exec();
    if (storyDelete.image?.key) {
      this.appService.deleteFile(storyDelete.image.key);
    }
    try {
      const deletedProduct = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedProduct) {
        throw new Error('El producto no se encontró para eliminar');
      }
      return deletedProduct;
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  async findBySupplier(supplier: string): Promise<Product[]> {
    try {
      return await this.productModel.find({ supplier }).exec();
    } catch (error) {
      throw new Error(`Error al buscar por proveedor: ${error.message}`);
    }
  }
}
