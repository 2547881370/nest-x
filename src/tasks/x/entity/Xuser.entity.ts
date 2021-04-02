import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { XarticleEntity } from './Xarticle.entity';

@Entity()
export class XuserEntity {
  @PrimaryGeneratedColumn()
  userID: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  nick: string;

  @Column()
  avatar: string;

  @Column('int')
  gender: number;

  @Column('int')
  age: number;

  @Column('int')
  role: number;

  @Column('int')
  experience: number;

  @Column('int')
  credits: number;

  @Column()
  identityTitle: string;

  @Column('bigint')
  identityColor: number;

  @Column('int')
  level: number;

  @Column('int')
  levelColor: number;

  @Column('int')
  integral: number;

  @Column('int')
  uuid: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  integralNick: string;

  @OneToMany((type) => XarticleEntity, (xarticle) => xarticle.user, {
    onDelete: 'CASCADE',
  })
  articles: XarticleEntity[];
}
