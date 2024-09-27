import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../entity/customer-login';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]), // Register the Customer entity with TypeORM
  ],
  controllers: [ProfileController], // Register the CustomerController
  providers: [ProfileService], // Register the CustomerService
})
export class ProfileModule {}
