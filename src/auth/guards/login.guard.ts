import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { userName, password } = request.body;

    const user = await this.authService.validateUsers(userName);

    if (!user) {
      throw new UnauthorizedException(`Неверный логин или пароль`);
    }

    const passwordVerification = await this.authService.сomparePassword(
      user.password,
      password,
    );

    if (!passwordVerification) {
      throw new UnauthorizedException(`Неверный логин или пароль`);
    }

    return true;
  }
}
