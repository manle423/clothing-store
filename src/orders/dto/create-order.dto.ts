import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber, IsOptional, IsPositive, ValidateNested, IsInt, IsDecimal, IsEnum } from "class-validator";
import { OrderStatus } from "../../entities/order-status.enum";

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  userId: number;

  @IsDecimal()
  @IsNotEmpty()
  totalPrice: number;
}
