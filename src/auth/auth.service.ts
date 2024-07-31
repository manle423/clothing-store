import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, RegisterDto } from './dto';
import { User } from 'src/entities';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) { }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (!decoded) throw new UnauthorizedException('Invalid token');
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  checkAdminRole(decoded: any) {
    if (decoded['roleId'] !== 1) {
      throw new UnauthorizedException('You do not have permission to perform this action.');
    }
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, repassword } = registerDto;

    if (password !== repassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ jwt: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id, roleId: user.roleId, email: user.email });

    return { jwt };
  }

  async findOne(condition: any): Promise<User> {
    if (!condition || Object.keys(condition).length === 0) {
      throw new Error('You must provide selection conditions in order to find a single row.');
    }
    return this.userRepository.findOne({ where: condition });
  }
}
