import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { XuserEntity } from './Xuser.entity';
import { XarticleEntity } from './Xarticle.entity';

@Entity()
export class XpraiseEntity {
  @PrimaryGeneratedColumn()
  praiseId: number;

  @Column('bigint')
  createTime: number;

  @ManyToOne((type) => XuserEntity, (xuser) => xuser.praiseId, {
    onDelete: 'CASCADE',
  })
  user: XuserEntity;

  @ManyToOne((type) => XarticleEntity, (xarticle) => xarticle.praiseId, {
    onDelete: 'CASCADE',
  })
  posts: XarticleEntity;
}
