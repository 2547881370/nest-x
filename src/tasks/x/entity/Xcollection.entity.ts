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
export class XcollectionEntity {
  @PrimaryGeneratedColumn()
  collectionId: number;

  @Column('bigint')
  createTime: number;

  @ManyToOne((type) => XuserEntity, (xuser) => xuser.collectionId, {
    onDelete: 'CASCADE',
  })
  user: XuserEntity;

  @ManyToOne((type) => XarticleEntity, (xarticle) => xarticle.collectionId, {
    onDelete: 'CASCADE',
  })
  posts: XarticleEntity;
}
