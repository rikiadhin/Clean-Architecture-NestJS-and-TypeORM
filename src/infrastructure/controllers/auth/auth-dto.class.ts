import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true, example : 'admin' })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true, example : 'password123' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
