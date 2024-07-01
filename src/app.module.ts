/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from './User/user.module';
import { UserEntity } from './User/user.entity';
import { UserController } from './User/user.controller';
import { UserEntityService } from './User/user.service';
import { AuthController } from './Auth/auth.controller';
import { AuthModule } from './Auth/auth.module';
import { AuthService } from './Auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '604800s' },
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'Aptovet',
      autoLoadEntities: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
      // dropSchema:true
    }),
    TypeOrmModule.forFeature([UserEntity]),
    // GlobalModule,
    AuthModule,
  ],
  controllers: [
    UserController,
    AuthController,
    // global

    // programmer
  ],
  providers: [UserEntityService, AuthService],
})
export class AppModule {}
