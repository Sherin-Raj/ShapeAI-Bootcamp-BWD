import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Customer } from 'src/entity/customer-login';
import { JwtService } from '@nestjs/jwt';
import {
  loginOtp,
  RefreshTokenDto,
  VerifyOtpDto,
} from 'src/dto/coustomer-login.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly jwtService: JwtService,
  ) {}

  // Generate and save OTP
  async sendOtp(
    loginOtp: loginOtp, // Use SendOtpDto here
  ): Promise<any> {
    const { phoneNumber } = loginOtp; // Extract phoneNumber from DTO
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    let customer = await this.customerRepository.findOneBy({ phoneNumber });

    if (!customer) {
      customer = this.customerRepository.create({
        phoneNumber,
        otp,
        otpExpiry,
      });
    } else {
      customer.otp = otp;
      customer.otpExpiry = otpExpiry;
    }

    await this.customerRepository.save(customer);

    // Implement SMS sending here, e.g., using Twilio
    // await this.sendOtpSms(phoneNumber, otp);

    return { message: 'OTP sent successfully.', otp };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto, // Use VerifyOtpDto here
  ): Promise<any> {
    const { phoneNumber, otp } = verifyOtpDto; // Extract phoneNumber and OTP from DTO
    console.log('verifyOtp called with phoneNumber:', phoneNumber, 'otp:', otp);

    const customer = await this.customerRepository.findOneBy({ phoneNumber });
    console.log('Customer fetched:', customer); // Log fetched customer

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (!this.isValidOtp(customer, otp)) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    customer.otp = null; // Clear OTP after successful verification
    customer.otpExpiry = null;
    await this.customerRepository.save(customer);

    const payload = { phoneNumber: customer.phoneNumber, id: customer.id };
    console.log('JWT payload:', payload); // Log the payload to be signed

    try {
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '576h', // Set the expiration directly
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1000h', // Set the expiration directly
      });
      console.log('Generated access token:', accessToken); // Log the generated access token
      return { message: 'Login successful', accessToken, refreshToken };
    } catch (error) {
      console.log('Error generating access token:', error); // Log any error during signing
      throw new BadRequestException('Failed to generate access token');
    }
  }

  async refreshToken(
    refreshToken: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken.refresh_token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('payload', payload);

      // Find the customer by ID and verify token validity
      const customer = await this.customerRepository.findOne({
        where: { id: payload.id },
      });
      console.log('customer', customer);

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Create a new access token
      const newAccessToken = this.jwtService.sign(
        { phoneNumber: customer.phoneNumber, id: customer.id },
        { secret: process.env.JWT_SECRET, expiresIn: '576h' },
      );

      // this.logger.log('Access token refreshed successfully');
      return { accessToken: newAccessToken };
    } catch (error) {
      // this.logger.error('Failed to refresh token:', error.stack);
      console.log('error', error);

      throw new BadRequestException('Invalid refresh token');
    }
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Helper function to validate OTP
  private isValidOtp(customer: Customer, otp: string): boolean {
    const isValid = customer.otp === otp && customer.otpExpiry > new Date();
    console.log('OTP validation result:', isValid); // Log OTP validation result
    return isValid;
  }
}
// Example function to send OTP via SMS (e.g., Twilio)
// private async sendOtpSms(phoneNumber: string, otp: string): Promise<void> {
//   // Twilio API integration logic
// }
