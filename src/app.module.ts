import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './_config/database';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(database),
    AuthModule,
    CategoriesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
