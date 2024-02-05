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
import { RefreshJWTGuard } from './guards/refresh-jwt.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto copy';

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

  @UseGuards(RefreshJWTGuard)
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const validToken = this.authService.verifyToken(
      refreshTokenDto.refreshToken,
    );

    const user = await this.usersService.findOne(refreshTokenDto.userName);

    const access = await this.authService.generateAccessToken(user);
    if (validToken?.error) {
      if (validToken?.error === 'jwt expired') {
        const refresh = await this.authService.generateRefreshToken(
          user._id.toString(),
        );
        res.statusCode = HttpStatus.OK;
        return res.send({ ...access, ...refresh });
      } else {
        res.statusCode = HttpStatus.BAD_REQUEST;
        return res.send({ error: validToken?.error });
      }
    } else {
      res.statusCode = HttpStatus.OK;
      return res.send({
        ...access,
        refreshToken: refreshTokenDto.refreshToken,
      });
    }
  }
}
