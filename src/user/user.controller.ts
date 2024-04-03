import {
  Controller,
  UseGuards,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserNicknameDto } from './dto/user.nickname.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('nickname')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async updateNickname(@Req() req, @Body() userNicknameDto: UserNicknameDto) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.userService.updateNickname(userNicknameDto, accessToken);
  }

  @Post('nickname/check')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async checkNickname(
    @Res() res: Response,
    @Body() userNicknameDto: UserNicknameDto,
  ) {
    await this.userService.checkNickname(userNicknameDto);
    return res.status(HttpStatus.OK).send('nickname available.');
  }
}
