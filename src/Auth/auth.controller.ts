import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Session,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { Response, Request } from 'express';
import { Public } from './public-strategy';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async signIn(
    @Body() signInDto: SignInDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
      session,
    );

    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      // path: '/auth/refresh-token',
      // secure: process.env.NODE_ENV === 'production', // use secure in production
      // sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });

    return res.json({ accessToken });
  }

  @Public()
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleLogin(req, res);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    return this.authService.refreshToken(req, res);
  }

  @Public()
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {
    return this.authService.logout(res);
  }
}
