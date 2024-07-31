import { Controller, Post, Body, Res, Get, Req, UnauthorizedException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      delete user.password;
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Registration successful',
        data: user,
      };
    } catch (error) {
      // Handle specific error scenarios
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      // Handle unexpected errors
      throw new BadRequestException('Registration failed');
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const { jwt } = await this.authService.login(loginDto);
      response.cookie('token', jwt, { httpOnly: true });
      return {
        statusCode: HttpStatus.OK,
        message: 'Logged in successfully',
      };
    } catch (error) {
      // Handle specific error scenarios
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      // Handle unexpected errors
      throw new UnauthorizedException('Login failed');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    try {
      response.clearCookie('token');
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully logged out',
      };
    } catch (error) {
      // Handle unexpected errors
      throw new BadRequestException('Logout failed');
    }
  }

  @Get('test')
  async user(@Req() request: Request) {
    try {
      const cookies = request.cookies['token'];
      if (!cookies) {
        throw new UnauthorizedException('Token not provided');
      }

      const data = await this.jwtService.verifyAsync(cookies);
      if (!data) {
        throw new UnauthorizedException('Invalid token');
      }

      const user = await this.authService.findOne({ id: data['id'] });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      // Handle specific error scenarios
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      // Handle unexpected errors
      throw new UnauthorizedException('Failed to retrieve user');
    }
  }

}
