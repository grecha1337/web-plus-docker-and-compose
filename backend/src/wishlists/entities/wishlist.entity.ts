import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { IsUrl, Length } from 'class-validator';
import { BaseEntity } from '../../entities/base.entity';
@Entity()
export class Wishlist extends BaseEntity {
  @Length(1, 250)
  @Column()
  name: string;

  @Length(1, 1500)
  @Column({ nullable: true })
  description: string;

  @IsUrl()
  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @ManyToMany(() => Wish, {
    cascade: true,
  })
  @JoinTable()
  items: Wish[];
}
