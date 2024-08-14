import { IsString, MaxLength, MinLength, IsNumber, IsOptional, IsPositive } from "class-validator";
import { CreateProductDTO } from "./create-product.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateProductDto extends PartialType(CreateProductDTO) {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock?: number;
  
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number;
}
