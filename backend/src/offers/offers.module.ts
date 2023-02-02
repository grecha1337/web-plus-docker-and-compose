import { forwardRef, Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    forwardRef(() => WishesModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
