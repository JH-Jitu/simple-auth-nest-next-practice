/* eslint-disable prettier/prettier */

import {
  Column,
  Entity,
  EventSubscriber,
  Generated,
  PrimaryColumn,
} from 'typeorm';

@Entity('user')
@EventSubscriber() // implements EntitySubscriberInterface
export class UserEntity {
  @Generated()
  // eslint-disable-next-line prettier/prettier
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  //   @Column({ nullable: true })
  //   imageName: string | null;

  @Column()
  photo: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
  })
  role: 'admin' | 'user';

  @Column('simple-array', { default: [] })
  permissions: ('creating' | 'adding' | 'deleting')[];
}
