import { IsEmail } from 'class-validator';

export class AuthRegisterUserDto {
  @IsEmail()
  email: string;
}
