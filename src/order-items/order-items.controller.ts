import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateOrderReqDto } from 'src/orders/dto/create-order-req.dto';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { OrderItemsService } from './order-items.service';

@Controller('order-items')
export class OrderItemsController {
  constructor(
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderItemsService,
  ) { }

  @Post()
  async createOrderItem(@Body() createOrderReqDto: CreateOrderReqDto, @Req() request: Request, @Res() response: Response) {

  }
}
