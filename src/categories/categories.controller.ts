import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpStatus, Param, Post, Put, Req, Res, UnauthorizedException } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { Response, Request } from 'express';

import { AuthService } from "../auth/auth.service";

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  async create(@Req() request: Request, @Body() createCategoryDto: CreateCategoryDto, @Res() response: Response) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      this.authService.checkAdminRole(decoded);

      // Create category
      const category = await this.categoriesService.create(createCategoryDto);

      // Return response
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      // Handle errors
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

  @Get()
  async findAll(@Res() response: Response) {
    try {
      const categories = await this.categoriesService.findAll();
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      // Handle unexpected errors
      throw new BadRequestException('Failed to retrieve categories');
    }
  }

  @Get(':id')
  async findById(@Res() response: Response, @Param('id') id: string) {
    try {
      const category = await this.categoriesService.findOne({ id });
      if (!category) {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
        });
      } else {
        return response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: 'Category retrieved successfully',
          data: category,
        });
      }
    } catch (error) {
      // Handle unexpected errors
      throw new BadRequestException('Failed to retrieve category');
    }
  }

  @Put(':id')
  async update(@Req() request: Request, @Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Res() response: Response) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      this.authService.checkAdminRole(decoded);

      // Update category
      const category = await this.categoriesService.update(id, updateCategoryDto);

      // Return response
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Category updated successfully',
        data: category,
      });

    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async delete(@Req() request: Request, @Param('id') id: string, @Res() response: Response) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      this.authService.checkAdminRole(decoded);

      // Delete category
      await this.categoriesService.delete(id);

      // Return response
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Category deleted successfully',
      });

    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }
}