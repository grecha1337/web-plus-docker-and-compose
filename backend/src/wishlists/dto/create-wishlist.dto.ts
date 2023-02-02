import { IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';

export class CreateWishlistDto {
  @Length(1, 250)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsOptional()
  itemsId: Wish[];
}
