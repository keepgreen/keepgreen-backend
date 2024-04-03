import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserNicknameDto } from './dto/user.nickname.dto';
import { JwtService } from '@nestjs/jwt';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';

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
      throw new BadRequestException('aff');
    }

    return;
  }
}
