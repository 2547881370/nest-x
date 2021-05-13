import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { XarticleEntity } from './Xarticle.entity';
import { XcommentsEntity } from './Xcomments.entity';

@Entity()
export class XdetailedEntity {
  @PrimaryGeneratedColumn()
  detailedId: number;

  @OneToOne(() => XarticleEntity)
  @JoinColumn()
  posts: XarticleEntity;

  @OneToMany((type) => XcommentsEntity, (comments) => comments.posts, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: XcommentsEntity[];
}
