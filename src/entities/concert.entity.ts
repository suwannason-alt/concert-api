import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ConsertUserEntity } from './user-concert.entity';
@Entity({ name: 'concert' })
export class ConcertEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  seat: number;

  @OneToMany(() => ConsertUserEntity, (consertUser) => consertUser.concert_uuid)
  consertUsers: ConsertUserEntity[];
}
