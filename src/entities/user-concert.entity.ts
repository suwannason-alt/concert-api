import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ConcertEntity } from './concert.entity';
@Entity({ name: 'consert-user' })
export class ConsertUserEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => ConcertEntity, (concert) => concert.consertUsers)
  @JoinColumn({ name: 'concert_uuid' })
  concert_uuid: string;
}
