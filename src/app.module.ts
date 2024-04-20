import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UserModule } from './user/user.module';
import { QuestsModule } from './quests/quests.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DrizzleModule,
    UserModule,
    QuestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
