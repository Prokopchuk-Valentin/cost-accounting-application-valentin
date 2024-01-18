import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas';
import { UsersService } from 'src/users/';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async ValidateUsers(userName: string): Promise<User | null> {
    const user = await this.usersService.findOne(userName);

    return user ? user : null;
  }
}
