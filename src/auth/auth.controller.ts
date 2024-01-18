import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { RegistrationGuard, LoginGuard } from './guards/';
import { UsersService } from 'src/users';
import { CreateUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const { userName } = await this.usersService.login(loginUserDto);
    res.statusCode = HttpStatus.OK;

    return res.send({ userName });
  }

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
