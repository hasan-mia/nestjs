import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password has to be between 6 and 20 characters' })
  public password: string;
}
