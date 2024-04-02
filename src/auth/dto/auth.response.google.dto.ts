import { IsEmail, IsString } from 'class-validator';

export class AuthResponseGoogleDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  picture: string;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
