import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SignInDto {
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  public email?: string;

  @IsOptional()
  @IsString()
  public username?: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password has to be between 6 and 20 characters' })
  public password: string;
}
