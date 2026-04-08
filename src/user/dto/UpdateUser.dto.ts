import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Role } from 'src/generated/prisma/enums';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @ApiProperty({ example: 'Jitendra Sahoo', description: 'Name of the entity' })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Length(1, 100)
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address',
    format: 'email',
  })
  readonly email: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Status of the user',
  })
  readonly status: boolean;

  @IsEnum(Role)
  @IsNotEmpty()
  @ApiProperty({
    example: Role.ADMIN,
    description: 'Role of the user',
  })
  readonly role: Role;
}
