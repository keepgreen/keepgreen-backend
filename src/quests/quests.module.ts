import { Module } from '@nestjs/common';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { drizzleProvider } from 'src/drizzle/drizzle.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1500s' },
      }),
    }),
  ],
  controllers: [QuestsController],
  providers: [QuestsService, JwtStrategy, ...drizzleProvider],
})
export class QuestsModule {}
