import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailAccountDeleteDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
