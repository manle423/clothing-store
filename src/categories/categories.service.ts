import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Category } from "../entities";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { CategoryRepository } from "./categories.repository";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: CategoryRepository
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);

    // Check if category is already have in database
    const existingCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (existingCategory) {
      throw new ConflictException('Category already in database');
    }

    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(condition: any): Promise<Category> {
    if (!condition || Object.keys(condition).length === 0) {
      throw new Error('You must provide selection conditions in order to find a single row.');
    }
    return await this.categoryRepository.findOne({ where: condition });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findOne({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    await this.categoryRepository.remove(category);
  }
}