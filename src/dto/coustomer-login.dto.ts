import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginOtp {
  @ApiProperty({
    description: 'Enter your country code',
    example: '+91',
  })
  @IsString()
  @IsNotEmpty()
  country_code: string;

  @ApiProperty({
    description:
      'The phone number of the customer, must be a valid 10-digit number',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number',
  })
  phoneNumber: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description:
      'The phone number of the customer, must be a valid 10-digit number',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number',
  })
  phoneNumber: string;

  @ApiProperty({
    description:
      'The OTP sent to the customer’s phone, must be a 6-digit number',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be a 6-digit number' })
  otp: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Refresh token is required' })
  refresh_token: string;
}

export class LogoutDto {
  @ApiProperty({ required: false })
  @IsNotEmpty({ message: 'Notification token is required' })
  notification_token: string;
}
