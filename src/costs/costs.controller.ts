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
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const user = await this.usersService.login(loginUserDto);

    const { userName } = user;
    res.statusCode = HttpStatus.OK;

    const { access_token: accessToken } =
      await this.authService.generateAccessToken(user);

    const { refresh_token: refreshToken } =
      await this.authService.generateRefreshToken(user._id as string);
    return res.send({ userName, accessToken, refreshToken });
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
