import { Controller, Get, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('customer')
export class ProfileController {
  constructor(private readonly customerService: ProfileService) {}

  @Get('profile')
  async findOne(@Req() req): Promise<any> {
    // console.log('req', req);

    const id = req.id;
    console.log('useriddd', id);

    if (!id) {
      throw new Error('User ID not found in request');
    }

    // Extract user ID from request/ Assuming 'userId' is the identifier in the JWT token
    const customer = await this.customerService.findProfile(id);
    return { customer };
  }

  // Other methods...
}
