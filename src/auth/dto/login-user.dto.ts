import { IsNotEmpty } from 'class-validator';
import { User } from 'src/schemas/users.schemas';

export class LoginUserDto extends User {
  @IsNotEmpty()
  readonly userName: string;

  @IsNotEmpty()
  readonly password: string;
}
