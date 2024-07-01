/* eslint-disable prettier/prettier */
import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class ValidateUserProfile {
  id: number;
  @IsString()
  @Length(4, 30, {
    message: 'Name must be between 4 and 30 characters',
  })
  name: string;

  @IsString()
  @Matches(/^[a-z0-9]+$/, {
    message: 'Username must contain only lowercase letters and numbers',
  })
  username: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Length(8, undefined, {
    message: 'Password must be at least 8 characters',
  })
  @Matches(/^(?=.*[A-Z])/i, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  password: string;

  @Length(11, 11, {
    message: 'Invalid Phone Number',
  })
  phone: string;

  // @MaxLength(30, {
  //   message: 'Image name must be at most 30 characters',
  // })
  //   imageName: string;

  // Ensure to match the DTO with the form structure
  photo: string;

  role: 'user' | 'admin';

  permissions: ('creating' | 'adding' | 'deleting')[];
}
