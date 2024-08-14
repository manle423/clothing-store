import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, Product } from '../entities';
import { ProductRepository } from './products.repository';
import { CategoryRepository } from '../categories/categories.repository';
import { CreateProductDTO, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
  ) { }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async create(createProductDTO: CreateProductDTO): Promise<Product> {
    const product = this.productRepository.create(createProductDTO);
    return await this.productRepository.save(product);
  }

  async findOne(condition: any): Promise<Product> {
    if (!condition || Object.keys(condition).length === 0) {
      throw new Error('You must provide selection conditions in order to find a single row.');
    }
    return await this.productRepository.findOne({ where: condition });
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async delete(id: number): Promise<void> {
    const product = await this.findOne({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    await this.productRepository.remove(product);
  }
}
