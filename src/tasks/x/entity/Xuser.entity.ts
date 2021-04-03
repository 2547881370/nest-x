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

  @Column({ default: null })
  nick: string;

  @Column({ default: null })
  avatar: string;

  @Column({ default: null, type: 'int' })
  gender: number;

  @Column({ default: null, type: 'int' })
  age: number;

  @Column({ default: null, type: 'int' })
  role: number;

  @Column({ default: null, type: 'int' })
  experience: number;

  @Column({ default: null, type: 'int' })
  credits: number;

  @Column({ default: null })
  identityTitle: string;

  @Column({ default: null, type: 'bigint' })
  identityColor: number;

  @Column({ default: null, type: 'int' })
  level: number;

  @Column({ default: null, type: 'int' })
  levelColor: number;

  @Column({ default: null, type: 'int' })
  integral: number;

  @Column({ default: null, type: 'int' })
  uuid: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  integralNick: string;

  @OneToMany((type) => XarticleEntity, (xarticle) => xarticle.user, {
    onDelete: 'CASCADE',
  })
  articles: XarticleEntity[];
}
