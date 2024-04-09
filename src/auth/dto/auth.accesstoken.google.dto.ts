import { IsString } from 'class-validator';

export class AuthAccessTokenDto {
  @IsString()
  accessToken: string;
}
