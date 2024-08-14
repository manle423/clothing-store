import { Type } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { Category } from "../../entities";

export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number;
  
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;
  // @ValidateNested()
  // @Type(() => Category)
  // categoryId: number;


}
