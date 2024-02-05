import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from 'src/users';

@Injectable()
export class RefreshJWTGuard implements CanActivate {
  constructor(private usersService: UsersService) {}
  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { refreshToken, userName } = request.body;

    if (!refreshToken) {
      throw new UnauthorizedException('Поле refreshToken обязательно!');
    } else if (!userName) {
      throw new UnauthorizedException('Поле userName обязательно!');
    }

    const user = await this.usersService.findOne(userName);

    if (!user) {
      throw new UnauthorizedException('User не существует!');
    }
    return true;
  }
}
