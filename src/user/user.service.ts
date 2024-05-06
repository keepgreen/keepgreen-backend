import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserNicknameDto } from './dto/user.nickname.dto';
import { JwtService } from '@nestjs/jwt';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from 'src/drizzle/schema';
import { and, desc, eq } from 'drizzle-orm';
import { UserWalletDto } from './dto/user.wallet.dto';
import { UserEmailAccountDeleteDto } from './dto/user.email.account.delete.dto';
import { EmailService } from 'src/mailer/EmailService';

@Injectable()
export class UserService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
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

  async getBalance(accessToken) {
    const decoded = this.jwtService.decode(accessToken);
    const id = decoded.sub;

    const userBalance = await this.db
      .select({
        balance: schema.balances.balance,
      })
      .from(schema.balances)
      .where(eq(schema.balances.idUser, id))
      .orderBy(desc(schema.balances.id))
      .limit(1);

    if (userBalance.length === 0) {
      return { balance: 0 };
    }

    return { balance: Number(userBalance[0].balance) };
  }

  async userDeletion(userEmailAccountDeleteDto: UserEmailAccountDeleteDto) {
    const { email } = userEmailAccountDeleteDto;
    const user = await this.db
      .select({
        id: schema.users.id,
      })
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (user.length === 0) return { message: 'success' };

    await this.db.insert(schema.userDelete).values({
      email: email,
    });

    const result = await this.db
      .select({ key: schema.userDelete.key })
      .from(schema.userDelete)
      .where(eq(schema.userDelete.email, email))
      .orderBy(desc(schema.userDelete.id))
      .limit(1);

    if (result.length === 0) return { message: 'success' };

    await this.emailService.sendEmail(
      email,
      'Account Delete | Keep Green',
      `
        <main style="display:flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; text-align: center;">
          <div style="width: 100%; text-align: center;">
            <img src="https://keepgreen.xyz/keepgreen.png" alt="Keep Green" style="width: 220px">
          </div>
          <h1 style="color: #20E09B; border-bottom: 1px solid #19C487">Account Delete</h1>
          <p>Sorry to see you go! To permanently delete your account, please <a href="https://keepgreen.xyz/user/delete-confirm?email=${email}&tk=${result[0].key}">click here.</a></p>
          <div style="color: #19C487; margin-top: 15px">
            Keep Green @ 2024
          </div>
        </main>
      `,
    );
    return { message: 'success' };
  }

  async deleteConfirm(email, tk) {
    await this.db
      .update(schema.userDelete)
      .set({ flagValidDelete: 1 })
      .where(
        and(eq(schema.userDelete.email, email), eq(schema.userDelete.key, tk)),
      );

    const result = await this.db
      .select({ flagValidDelete: schema.userDelete.flagValidDelete })
      .from(schema.userDelete)
      .where(eq(schema.userDelete.email, email))
      .orderBy(desc(schema.userDelete.id))
      .limit(1);

    if (!result || result[0].flagValidDelete != 1) {
      return {
        message:
          'The request to remove the account could not be confirmed, please try again or contact support.',
      };
    }

    return {
      message:
        'We have confirmed your request to remove the account, we are working on it, it may take up to 3 days.',
    };
  }
}
