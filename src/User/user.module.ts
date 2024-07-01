/* eslint-disable prettier/prettier */
// import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
// import { AppService } from 'src/app.service';
import { UserEntityService } from './user.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserEntityService],
  exports: [UserEntityService],
})
export class UserModule {}
