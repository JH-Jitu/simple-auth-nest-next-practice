/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntityService } from 'src/User/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserEntityService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
    session: Record<string, any>,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password did not match');
    }

    session.email = email;
    session.role = user.role;
    const payload = { sub: user.email, username: user.username };

    console.log('eituk kaaj korse');
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken };
  }

  async googleLogin(req, res) {
    if (!req.user) {
      return 'No user from google';
    }

    console.log({ 'user of google': req.user });

    res.cookie('refreshtoken', req.user.accessToken, {
      httpOnly: true,
      // path: '/auth/refresh-token',
      // secure: process.env.NODE_ENV === 'production', // use secure in production
      // sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    });
    res.redirect('http://localhost:3000/SSOSuccess');

    return {
      message: 'User Info from Google',
      user: req.user,
    };
  }
  hello() {
    return 'Hello';
  }

  async refreshToken(req: Request, res: Response): Promise<any> {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(400).json({ msg: 'Please login or register' });
      }

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            return res.status(400).json({ msg: 'Please login or register' });
          }

          const accessToken = await this.jwtService.signAsync({ id: user.id });
          // res.clearCookie('refreshtoken');
          // res.cookie('refreshtoken', accessToken, {
          //   httpOnly: true,
          //   // path: '/auth/refresh-token',
          //   // secure: process.env.NODE_ENV === 'production', // use secure in production
          //   // sameSite: 'strict',
          //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
          // });
          return res.json({ accessToken });
        },
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  async logout(res: Response): Promise<any> {
    res.clearCookie('refreshtoken', { path: '/auth/refresh-token' });
    return res.json({ msg: 'Logged out!' });
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: 'http://localhost:3334/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
