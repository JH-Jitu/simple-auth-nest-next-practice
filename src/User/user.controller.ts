/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Put,
  Patch,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
  Session,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { ValidateUserProfile } from './user.dto';
//   import { SessionGuard } from './session.guard';
import { UserEntityService } from './user.service';
import { UserEntity } from './user.entity';
import { Public } from 'src/Auth/public-strategy';
import { AuthGuard } from 'src/Auth/auth.guard';

// const recruiters = [];
// const companies = [];
// const users = [];

// User Controller
// Staging added

@Controller('user')
export class UserController {
  constructor(
    private appService: UserEntityService,
    //   private growthService: GrowthEntityService,
  ) {}

  // Read all User
  @Get('get-users')
  // @UseGuards(SessionGuard)
  getUser() {
    return this.appService.getAllUserEntitys();
  }

  // Get Profile
  // @Public()
  @UseGuards(AuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req) {
    console.log({ req });
    const email = req.sub;
    // console.log('eta kaaj korena');
    return await this.appService.findById(email);
  }

  //   Create User
  @Public()
  @Post('create-user')
  @UsePipes(new ValidationPipe())
  //   @UseInterceptors(
  //     FileInterceptor('imageName', {
  //       fileFilter: (req, file, cb) => {
  //         if (file.originalname.match(/^.*\.(jpg|png|jpeg)$/)) cb(null, true);
  //         else {
  //           cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //         }
  //       },

  //       limits: { fileSize: 6000000 },

  //       storage: diskStorage({
  //         destination: './uploads',

  //         filename: function (req, file, cb) {
  //           cb(null, Date.now() + file.originalname);
  //         },
  //       }),
  //     }),
  //   )
  createUser(
    @Body() profile: ValidateUserProfile,
    // @UploadedFile() file: Express.Multer.File,
  ) {
    // console.log(profile);
    // You can now use both 'profile' and 'file' to create the user entity
    // const fileName = file ? file.filename : null;
    const result = {
      ...profile,
      // imageName: fileName
    };

    return this.appService.createUserEntity(result);
  }

  // update user
  @Put('/update-user/:email')
  async updateUser(
    @Param('email') email: string,
    @Body() updatedUserData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    return this.appService.updateUserByEmail(email, updatedUserData);
  }

  // Read own user
  @Get('me/:email')
  getSingleUser(@Session() session, @Param('email') email: string) {
    console.log(session);
    session.email = email;
    return this.appService.getUserEntityById(email);
  }

  @Post('signin')
  async signIn(
    @Session() session,
    @Body() body: ValidateUserProfile,
  ): Promise<any> {
    try {
      const user = await this.appService.signIn(body.email, body.password);
      if (user) {
        session.email = user.email;
        return { status: 'success' };
      } else {
        throw new HttpException(
          'Invalid username or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('delete-user/:id')
  deleteUser(@Param('id') id): any {
    try {
      this.appService.deleteUserEntity(id);
    } catch (error) {
      console.log(error);
    }
    return { msg: 'Deleted Successfully' };
  }
}
