import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO, UpdateProductDto } from './dto';
import { CategoriesService } from '../categories/categories.service';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly authService: AuthService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) { }

  @Get()
  async findAll() {
    return await this.productsService.findAll();
  }

  @Post()
  async create(@Req() request: Request, @Res() response: Response, @Body() createProductDTO: CreateProductDTO) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      this.authService.checkAdminRole(decoded);

      // Check xem category có trong database hay không
      const categoryId = createProductDTO.categoryId;
      const category = await this.categoriesService.findOne({ id: categoryId })
      console.log(category);
      if (!category) {
        throw new NotFoundException('Invalid category: ' + categoryId);// nếu không thì đẩy lỗi ra
      }

      // Create product
      const product = await this.productsService.create(createProductDTO);

      // Return response
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: product,
      });

    } catch (error) {
      // Log the error for debugging
      console.error('Error:', error);

      // Handle errors
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

  @Get(':id')
  async findById(@Res() response: Response, @Param('id') id: string) {
    try {
      const product = await this.productsService.findOne({ id: parseInt(id) });
      if (!product) {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        });
      } else {
        return response.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          message: 'Product retrieved successfully',
          data: product,
        });
      }
    } catch (error) {
      // Handle unexpected errors
      throw new BadRequestException('Failed to retrieve product');
    }
  }

  @Put(':id')
  async update(@Req() request: Request, @Res() response: Response, @Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      this.authService.checkAdminRole(decoded);

      // Check xem category có trong database hay không
      const categoryId = updateProductDto.categoryId;
      const category = await this.categoriesService.findOne({ id: categoryId })
      console.log(category);
      if (!category) {
        throw new NotFoundException('Invalid category: ' + categoryId);// nếu không thì đẩy lỗi ra
      }

      // Update product
      const product = await this.productsService.update(parseInt(id), updateProductDto);

      // Return response
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
        data: product,
      });

    } catch (error) {
      // Log the error for debugging
      console.error('Error:', error);

      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async delete(@Req() request: Request, @Res() response: Response, @Param('id') id: string) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      this.authService.checkAdminRole(decoded);

      // Delete product
      await this.productsService.delete(parseInt(id));

      // Return response
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Product deleted successfully',
      });

    } catch (error) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }

}
