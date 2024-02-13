import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas';
import { UsersService } from 'src/users/';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUsers(userName: string): Promise<User | null> {
    const user = await this.usersService.findOne(userName);

    return user ? user : null;
  }

  async сomparePassword(
    hashPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashPassword);
  }

  async generateAccessToken(user: User) {
    const payload = { userName: user.userName, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(userId: string) {
    const payload = { _id: userId };
    return {
      refresh_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: '30d',
      }),
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return { error: error.message };
    }
  }

  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      globalThis
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }

  async getUserByTokenData(token: string): Promise<User> {
    const parsedTokenData = this.parseJwt(token);

    return await this.usersService.findOne(parsedTokenData.userName);
  }
}
