import {
  Controller,
  Get,
  Req,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuestsService } from './quests.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async findAll(@Req() req) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return this.questsService.findAll(accessToken);
  }
}
