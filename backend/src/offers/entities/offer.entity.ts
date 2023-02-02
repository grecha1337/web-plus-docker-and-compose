import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsNumber } from 'class-validator';
import { BaseEntity } from '../../entities/base.entity';
@Entity()
export class Offer extends BaseEntity {
  @IsNumber()
  @Column({ type: 'decimal' })
  amount: number;

  @IsBoolean()
  @Column({ default: false })
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;
}
