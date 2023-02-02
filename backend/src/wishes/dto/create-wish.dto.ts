import { IsNotEmpty, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  description: string;

  raised?: number;
}
