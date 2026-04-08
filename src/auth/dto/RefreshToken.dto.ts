import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIs...',
    description: 'The refresh token issued during login or previous refresh',
  })
  readonly refreshToken: string;
}
