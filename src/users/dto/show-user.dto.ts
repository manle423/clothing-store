import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ShowUserDto {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
}
