import { IsString, MaxLength, MinLength } from 'class-validator';

export class UserNicknameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  nickname: string;
}
