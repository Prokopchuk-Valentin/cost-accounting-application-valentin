import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas';
import { UsersService } from 'src/users/';
import * as bcrypt from 'bcrypt';
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
    const payload = { username: user.userName, sub: user._id };
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
}
