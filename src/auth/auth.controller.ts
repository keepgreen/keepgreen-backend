import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
// import { CheckTokenExpiryGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Request() req, @Res() res: Response) {
    const response = await this.authService.signInGoogle(req.user);
    res.json(response);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req) {
    const accessToken = req.headers.authorization.split(' ')[1];
    return await this.authService.getProfile(accessToken);
  }
}
