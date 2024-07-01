/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm'; // change this to your entity class
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

// MailerModule.forRoot({
//   transport: {
//     host: 'smtp.gmail.com',
//     port: 465,
//     ignoreTLS: true,
//     secure: true,
//     auth: {
//       user: '',
//       pass: '',
//     },
//   },
// });

@Injectable()
export class UserEntityService {
  constructor(
    @InjectRepository(UserEntity)
    private UserEntityRepository: Repository<UserEntity>,
  ) {}
  // UserEntityRepository is the local repository
  async createUserEntity(userEntity: UserEntity): Promise<UserEntity> {
    try {
      // const admin = new UserEntity();
      // // Set other properties of admin...

      const existingUser = await this.UserEntityRepository.findOne({
        where: { email: userEntity.email },
      });

      if (existingUser) {
        throw new Error('Email address is already in use');
      }

      const passwordHash = await bcrypt.hash(userEntity.password, 10);

      //   const user = new UserEntity();
      //   user.email = adminEntity.email;
      //   user.role = 'admin';

      //   adminEntity.user = user;

      console.log({ userEntity });

      return this.UserEntityRepository.save({
        ...userEntity,
        password: passwordHash,
      });
      // this.UsersEntityRepository.save(user);

      // return adminEntity;
      // return this.UserEntityRepository.save(adminEntity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // Handle duplicate email error
        throw new Error('Email address is already in use');
      }
      // Handle other errors or rethrow
      throw new Error('Email address is already in use');
    }
  }

  async updateUserByEmail(
    email: string,
    updatedUserData: Partial<UserEntity>,
  ): Promise<UserEntity> {
    try {
      // Find the admin by email
      const admin = await this.UserEntityRepository.findOneBy({ email });

      if (!admin) {
        throw new NotFoundException('User not found');
      }

      // Update the admin's data
      Object.assign(admin, updatedUserData);

      // Save the updated admin entity
      const updatedUser = await this.UserEntityRepository.save(admin);

      return updatedUser;
    } catch (error) {
      // Handle errors or rethrow
      throw new Error('Failed to update admin');
    }
  }

  async getAllUserEntitys(): Promise<UserEntity[]> {
    return this.UserEntityRepository.find();
  }
  async getUserEntityById(email: string): Promise<UserEntity> {
    return this.UserEntityRepository.findOneBy({ email: email });
  }

  //   private mailerService: MailerService;

  async signIn(email: string, password: string): Promise<UserEntity> {
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Email',
    //   text: 'Done',
    // });
    return this.UserEntityRepository.findOneBy({
      email: email,
      password: password,
    });
  }

  // // User Profile Update
  // async updateUserEntity(
  //   id: number,
  //   updatedUserEntity: ValidateUserProfile,
  // ): Promise<UserEntity> {
  //   await this.UserEntityRepository.update(id, updatedUserEntity);
  //   const profile = this.UserEntityRepository.findOneBy({ id: id });
  //   return profile;
  // }

  async deleteUserEntity(id: number): Promise<void> {
    await this.UserEntityRepository.delete(id);
  }

  // Finding user
  async findOne(email: string): Promise<UserEntity> {
    return this.UserEntityRepository.findOneBy({ email });
  }

  // The Task:
  async findById(email: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.UserEntityRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }
}

// Relation
// @Injectable()
// export class All3RelationService {
//   constructor(
//     @InjectRepository(RelationEntity)
//     private UserEntityRepository: Repository<RelationEntity>,
//   ) {}

//   async getAllUserEntitys(): Promise<RelationEntity[]> {
//     return this.UserEntityRepository.find();
//   }
// }
