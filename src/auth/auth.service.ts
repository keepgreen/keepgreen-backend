import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { init } from '@paralleldrive/cuid2';
import { AuthAccessTokenDto } from './dto/auth.accesstoken.google.dto';
import { AuthGoogleUserDataDto } from './dto/auth.google.user.data.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const url = this.configService.get<string>('GOOGLE_TOKEN_INFO_URL');
      const response = await axios.get(`${url}?access_token=${token}`);

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async generateJwt(payload) {
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signInGoogle(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    if (await this.isTokenExpired(user.accessToken)) {
      throw new UnauthorizedException('User not authorized');
    }

    const userExists = await this.db
      .select({ id: schema.users.id, email: schema.users.email })
      .from(schema.users)
      .where(eq(schema.users.email, user.email));

    if (userExists.length === 0) {
      return this.registerUser(user);
    }

    return await this.generateJwt({
      email: userExists[0].email,
      sub: userExists[0].id,
    });
  }

  async generateReferral() {
    const createId = init({
      random: Math.random,
      length: 6,
      fingerprint: 'keepgreen',
    });
    let referral = createId();
    const user = await this.db
      .select({ referral: schema.users.referral })
      .from(schema.users)
      .where(eq(schema.users.referral, referral));
    if (user.length > 0) {
      referral = createId();
    }
    return referral;
  }

  async registerUser(user) {
    try {
      const referralCode = await this.generateReferral();
      const newUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photoPath: user.picture,
        referral: referralCode,
      };

      await this.db.insert(schema.users).values(newUser);

      const userExists = await this.db
        .select({ id: schema.users.id, email: schema.users.email })
        .from(schema.users)
        .where(eq(schema.users.email, user.email));

      if (userExists.length === 0)
        throw new InternalServerErrorException(
          `Even after registration couldn't find user`,
        );

      return await this.generateJwt({
        email: userExists[0].email,
        sub: userExists[0].id,
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        `Server couldn't register the new user`,
      );
    }
  }

  async signInGoogleMobile(accessTokenGoogle: AuthAccessTokenDto) {
    const { accessToken } = accessTokenGoogle;

    const userGoogle = await this.getUserDataFromGoogle(accessToken);

    if (!userGoogle) {
      throw new BadRequestException('Wrong accessToken');
    }

    try {
      const userExists = await this.db
        .select({ id: schema.users.id, email: schema.users.email })
        .from(schema.users)
        .where(eq(schema.users.email, userGoogle.email));

      if (userExists.length === 0) {
        const user = {
          email: userGoogle.email,
          firstName: userGoogle.name,
          lastName: userGoogle.given_name,
          picture: userGoogle.picture,
        };
        return await this.registerUser(user);
      }

      return await this.generateJwt({
        email: userExists[0].email,
        sub: userExists[0].id,
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error');
    }
  }

  private async getUserDataFromGoogle(
    accessToken: string,
  ): Promise<AuthGoogleUserDataDto> {
    try {
      const url = this.configService.get<string>('GOOGLE_GET_DATA_URL');
      return await axios.get(`${url}?alt=json&access_token=${accessToken}`);
    } catch (error) {
      console.log(error);
    }
    return;
  }
}
