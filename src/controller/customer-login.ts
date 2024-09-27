import { Controller, Post, Body } from '@nestjs/common';
import {
  loginOtp,
  RefreshTokenDto,
  VerifyOtpDto,
} from 'src/dto/coustomer-login.dto';
import { CustomerService } from 'src/service/customer-login';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('login')
  async sendOtp(
    @Body() sendOtpDto: loginOtp, // Use the correct DTO name
  ): Promise<{ message: string; otp: string }> {
    console.log('phoneNumber', sendOtpDto.phoneNumber);

    // Call the service method and pass the DTO
    return this.customerService.sendOtp(sendOtpDto);
  }

  @Post('verify')
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto, // Use the VerifyOtpDto for validation
  ): Promise<{ message: string; accessToken: string }> {
    // Call the service method to verify OTP and send the access token
    return this.customerService.verifyOtp(verifyOtpDto);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshToken: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    return this.customerService.refreshToken(refreshToken);
  }
  // @Post('logout')
  // async logout(
  //   @Body('refreshToken') refreshToken: string,
  // ): Promise<{ message: string }> {
  //   return this.customerService.logout(refreshToken);
  // }
}
