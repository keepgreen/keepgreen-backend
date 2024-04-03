import { IsString } from 'class-validator';

export class UserNicknameDto {
  @IsString()
  nickname: string;
}
