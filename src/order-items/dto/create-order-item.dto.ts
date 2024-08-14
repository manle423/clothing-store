import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber, IsOptional, IsPositive, ValidateNested, IsInt, IsDecimal, IsEnum } from "class-validator";
import { OrderStatus } from "../../entities/order-status.enum";

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  @IsPositive()
  price: number;
}
