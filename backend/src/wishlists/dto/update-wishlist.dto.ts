import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: Wish[];
}
