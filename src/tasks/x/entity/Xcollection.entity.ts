import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { XuserEntity } from './Xuser.entity';
import { XarticleEntity } from './Xarticle.entity';

@Entity()
export class XcollectionEntity {
  @PrimaryGeneratedColumn()
  collectionId: number;

  @OneToOne(() => XuserEntity)
  @JoinColumn()
  user: XuserEntity;

  @OneToOne(() => XarticleEntity)
  @JoinColumn()
  posts: XarticleEntity;
}
