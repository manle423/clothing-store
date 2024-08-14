import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './_config/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(database),
    AuthModule,
    CategoriesModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    OrderItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
