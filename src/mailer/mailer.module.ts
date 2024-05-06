import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './EmailService';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<string>('SMTP_PORT'),
          secureConnection: false,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
          tls: {
            ciphers: 'SSLv3',
          },
        },
        defaults: {
          from: configService.get<string>('SMTP_FROM'),
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [MailerModule],
})
export class MailerConfigModule {}
