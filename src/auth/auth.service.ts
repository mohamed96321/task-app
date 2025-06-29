import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const u = await this.users.findByEmail(email);
    if (u && (await bcrypt.compare(pass, u.password))) {
      const { password, ...rest } = u;
      return rest;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    return {
      access_token: this.jwt.sign({ sub: user.id, email: user.email }),
    };
  }

  async register(dto: CreateUserDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already exists');

    const user = await this.users.create(dto);
    const { password, ...result } = user;

    return {
      message: 'Registration successful',
      user: result,
      access_token: this.jwt.sign({ sub: user.id, email: user.email }),
    };
  }
}
