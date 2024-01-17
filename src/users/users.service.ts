import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User, UsersDocument } from 'src/schemas/users.schemas';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UsersDocument>,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<User | null> {
    const { userName, password } = createUserDto;
    const existingUser = await this.findOne(userName);

    if (existingUser) {
      return null;
    }

    const hashPassword = await this.HashPassword(password);
    const createdUser = new this.usersModel({
      userName,
      password: hashPassword,
    });

    return createdUser.save();
  }

  async HashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 8);
    return hashPassword;
  }

  async comparePasswor(
    hashPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, hashPassword);
  }

  async findOne(userName: string): Promise<User> {
    return await this.usersModel.findOne({ userName });
  }
}
