import { Inject, Injectable } from '@nestjs/common';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { MySql2Database } from 'drizzle-orm/mysql2';
import * as schema from 'src/drizzle/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class QuestsService {
  constructor(
    @Inject(DrizzleAsyncProvider) private db: MySql2Database<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async findAll(accessToken: string) {
    const decoded = this.jwtService.decode(accessToken);

    const quests = await this.db
      .select({
        id: schema.quests.id,
        title: schema.quests.title,
        description: schema.quests.description,
        tinsRequired: schema.quests.tinsRequired,
      })
      .from(schema.quests)
      .leftJoin(
        schema.questsCompleted,
        and(
          eq(schema.quests.id, schema.questsCompleted.idQuest),
          eq(schema.questsCompleted.idUser, decoded.sub),
        ),
      )
      .where(isNull(schema.questsCompleted.id));

    return quests;
  }
}
