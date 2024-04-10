import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserNicknameDto } from './dto/user.nickname.dto';
import { JwtService } from '@nestjs/jwt';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { UserWalletDto } from './dto/user.wallet.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async checkNickname(userNicknameDto: UserNicknameDto) {
    const { nickname } = userNicknameDto;
    const user = await this.db
      .select({ nickname: schema.users.nickname })
      .from(schema.users)
      .where(eq(schema.users.nickname, nickname));

    if (user.length > 0)
      throw new BadRequestException('Nickname not available.');

    return;
  }

  async updateNickname(userNicknameDto: UserNicknameDto, accessToken) {
    const id = this.jwtService.decode(accessToken).sub;

    const { nickname } = userNicknameDto;
    const user = await this.db
      .select({ nickname: schema.users.nickname })
      .from(schema.users)
      .where(eq(schema.users.nickname, nickname));

    if (user.length > 0)
      throw new BadRequestException('Nickname not available.');

    try {
      await this.db
        .update(schema.users)
        .set({ nickname: nickname })
        .where(eq(schema.users.id, id));
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Couldn't register user nickname`);
    }

    return;
  }

  async getProfile(accessToken) {
    const decoded = this.jwtService.decode(accessToken);
    const id = decoded.sub;

    const user = await this.db
      .select({
        nickname: schema.users.nickname,
        level: schema.users.level,
        email: schema.users.email,
        wallet: schema.users.wallet,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id));

    if (user.length === 0) throw new BadRequestException('User not Found.');

    return user[0];
  }

  async updateWallet(userWalletDto: UserWalletDto, accessToken) {
    const decoded = this.jwtService.decode(accessToken);
    const id = decoded.sub;
    const { wallet } = userWalletDto;

    const userWallet = await this.db
      .select({
        wallet: schema.users.wallet,
      })
      .from(schema.users)
      .where(eq(schema.users.id, id));

    if (userWallet?.[0].wallet == wallet) {
      throw new BadRequestException(
        'This wallet is already saved for this user.',
      );
    }

    try {
      await this.db
        .update(schema.users)
        .set({ wallet: wallet })
        .where(eq(schema.users.id, id));
    } catch (error) {
      throw new BadRequestException('Error');
    }
    return;
  }
}
