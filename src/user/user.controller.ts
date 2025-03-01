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
  Get,
  Render,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserNicknameDto } from './dto/user.nickname.dto';
import { Response } from 'express';
import { UserWalletDto } from './dto/user.wallet.dto';
import { UserEmailAccountDeleteDto } from './dto/user.email.account.delete.dto';

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
    return res.status(HttpStatus.OK).json({ message: 'nickname available.' });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.userService.getProfile(accessToken);
  }

  @Post('wallet')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async updateWallet(@Req() req, @Body() userWalletDto: UserWalletDto) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.userService.updateWallet(userWalletDto, accessToken);
  }

  @Get('balance')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async getBalance(@Req() req) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.userService.getBalance(accessToken);
  }

  @Get('delete')
  @Render('user/delete')
  async delete() {
    return {};
  }

  @Get('delete-confirm')
  @Render('user/delete-confirm')
  async deleteConfirm(@Req() req) {
    const { email, tk } = req.query;
    return await this.userService.deleteConfirm(email, tk);
  }

  @Post('delete')
  @UsePipes(ValidationPipe)
  async deleteAction(
    @Body() userEmailAccountDeleteDto: UserEmailAccountDeleteDto,
  ) {
    return await this.userService.userDeletion(userEmailAccountDeleteDto);
  }
}
