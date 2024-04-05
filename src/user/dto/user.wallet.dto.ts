import { MinLength, MaxLength, IsString } from 'class-validator';

export class UserWalletDto {
  @IsString()
  @MinLength(32)
  @MaxLength(44)
  wallet: string;
}
