import { Controller, Get, Post, Body, Param, Put, Delete, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAllUsers(@Res() res: Response) {
    const users = await this.usersService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    });
  }

  @Get(':id')
  async getUser(@Param('id') id: number, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User fetched successfully',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.usersService.create(createUserDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: newUser,
    });
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.usersService.remove(id);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: error.message,
      });
    }
  }
}