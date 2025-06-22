import { Column, Entity, Generated, OneToMany, PrimaryColumn } from 'typeorm';
import { ConsertUserEntity } from './user-concert.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn()
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @OneToMany(() => ConsertUserEntity, (consertUser) => consertUser.user_uuid, {
    onDelete: 'CASCADE',
  })
  consertUser: ConsertUserEntity[];
}
