import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
  Res,
  Query,
  Render,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Public } from '@/helpers/decorator/public';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { ResetpassAuthDto } from './dto/resetpassword-auth.dto';
import { Throttle } from '@nestjs/throttler';
import { Roles } from '@/helpers/decorator/roles';
import { ResponseDto } from '@/helpers/utils';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.login(req.user);

    response.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return token;
  }

  @Get('renew_token/:refreshToken')
  @Public()
  async renewToken(@Param('refreshToken') refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }

  @Get('profile')
  @Roles("user", "hotelier", "admin")
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register/:role')
  @Public()
  async register(
    @Body() createAuthDto: CreateAuthDto,
    @Param('role') role: string,
  ) {
    return this.authService.register(createAuthDto, role);
  }

  @Get('verify-email')
  @Public()
  @Render('activation-email')
  async verifyEmail(@Query('token') token: string) {
    const {error, email} = await this.authService.verifyEmail(token);
    if (!error) {
      return {
        error: false,
        message: 'Your account has been activated',
        verifyUrl: 'http://localhost:3000/login'
      }
    } else {
      return {
        error: true,
        message: 'Activation link is invalid or expired, please try again',
        verifyUrl: 'http://localhost:3001/api/auth/verify-email/resend?email=' + email
      }
    }
  }

  @Get('verify-email/resend')
  @Public()
  async resendVerifyEmail(@Query('email') email: string) {
    return await this.authService.resendActivationEmail(email);
  }

  @Get('forgetPassword/:email')
  @Public()
  async forgetPassword(@Param('email') email: string) {
    return await this.authService.forgetPassword(email);
  }

  @Post('resetPassword')
  @Public()
  async resetPassword(@Body() resetInfo: ResetpassAuthDto) {
    return await this.authService.resetPassword(resetInfo);
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    return 'successfully';
  }

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.loginWithGoogle(req.user);
  }

  // @Post('login')
  // login(@Body() createAuthDto : CreateAuthDto) {
  //   console.log(createAuthDto);
  //   return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  // }
}
