import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities';
import { OrderRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
  ) { }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order>  {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }
}
