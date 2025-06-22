import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConcertEntity } from './concert.entity';
import { UserEntity } from './user.entity';
@Entity({ name: 'concert-user' })
export class ConsertUserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  create_at: Date;

  @Column()
  action: string;

  @ManyToOne(() => ConcertEntity, (concert) => concert.concertUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'concert_uuid' })
  concert_uuid: string;

  @ManyToOne(() => UserEntity, (user) => user.consertUser, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_uuid' })
  user_uuid: string;
}
