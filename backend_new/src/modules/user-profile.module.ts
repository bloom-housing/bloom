import { Module } from '@nestjs/common';
import { UserProfileController } from '../controllers/user-profile.controller';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [UserProfileController],
})
export class UserProfileModule {}
