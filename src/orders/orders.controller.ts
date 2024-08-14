import { Body, Controller, HttpStatus, InternalServerErrorException, NotFoundException, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderReqDto } from './dto/create-order-req.dto';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderItemDto } from '../order-items/dto/create-order-item.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService
  ) {}

  @Post()
  async createOrder(@Body() createOrderReqDto: CreateOrderReqDto, @Req() request: Request, @Res() response: Response) {
    try {
      const token = request.cookies['token'];
      if (!token) throw new UnauthorizedException('Token does not exist');

      const decoded = await this.authService.validateToken(token);
      if (!decoded) throw new UnauthorizedException('Invalid token');

      // Check xem product có trong database hay không
      const productId = createOrderReqDto.productId;
      const product = await this.productsService.findOne({ id: productId });
      if (!product) throw new NotFoundException('Product not found');

      const createOrderDto : CreateOrderDto = { userId: decoded.userId, totalPrice: 0 }
      const order = await this.ordersService.createOrder(createOrderDto);

      if (!order) throw new InternalServerErrorException('Failed to create order');

      // Return response
      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Category created successfully',
        data: '',
      });
    } catch (error) {
      // Handle errors
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: error.message,
      });
    }
  }
}
