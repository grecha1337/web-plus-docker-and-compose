import { IsInt, IsNumber, IsUrl, Length } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../entities/base.entity';
@Entity()
export class Wish extends BaseEntity {
  @Length(1, 250)
  @Column()
  name: string;

  @IsUrl()
  @Column()
  link: string;

  @IsUrl()
  @Column()
  image: string;

  @IsNumber()
  @Column({ type: 'decimal' })
  price: number;

  @IsNumber()
  @Column({
    default: 0,
  })
  raised: number;

  @Length(1, 1024)
  @Column()
  description: string;

  @IsInt()
  @Column({
    default: 0,
  })
  copied: number;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
