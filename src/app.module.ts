import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserModule } from './user/user.module';
import { QuestsModule } from './quests/quests.module';
import { MailerConfigModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DrizzleModule,
    UserModule,
    QuestsModule,
    MailerConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
