import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber, IsOptional, IsPositive, ValidateNested, IsInt, IsDecimal, IsEnum } from "class-validator";
import { OrderStatus } from "../../entities/order-status.enum";

export class CreateOrderReqDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
