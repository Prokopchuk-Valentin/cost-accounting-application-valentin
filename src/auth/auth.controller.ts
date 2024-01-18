import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RegistrationGuard } from './guards/auth.guard';
import { UsersService } from 'src/users';
import { CreateUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @UseGuards(RegistrationGuard)
  @Post('registration')
  async registrationUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.usersService.registration(createUserDto);
    res.statusCode = HttpStatus.CREATED;

    return res.send('user created');
  }
}
