import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Body,
  UsePipes,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthAccessTokenDto } from './dto/auth.accesstoken.google.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    res.json(await this.authService.signInGoogle(req.user));
  }

  @Post('google/login')
  @UsePipes(ValidationPipe)
  async googleLoginMobile(
    @Res() res: Response,
    @Body() authAccessTokenDto: AuthAccessTokenDto,
  ) {
    res.json(await this.authService.signInGoogleMobile(authAccessTokenDto));
  }
}
