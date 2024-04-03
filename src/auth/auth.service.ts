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
      .select()
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

  async registerUser(user) {
    try {
      const createId = init({
        random: Math.random,
        length: 10,
        fingerprint: 'keepgreen',
      });
      const referralCode = createId();
      const newUser = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photoPath: user.picture,
        referral: referralCode,
      };

      await this.db.insert(schema.users).values(newUser);

      const userExists = await this.db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, user.email));

      if (userExists.length === 0) throw new InternalServerErrorException();

      return await this.generateJwt({
        email: userExists[0].email,
        sub: userExists[0].id,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
