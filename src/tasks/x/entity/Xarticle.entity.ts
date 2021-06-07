import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Index,
} from 'typeorm';
import { XimageEntity } from './Ximage.entity';
import { XuserEntity } from './Xuser.entity';
import { XarticleInterface } from '../interface/xarticle.interface';
import { XpraiseEntity } from './Xpraise.entity';
import { XcollectionEntity } from './Xcollection.entity';
import { Xhistory } from './Xhistory.entity';

@Entity()
export class XarticleEntity implements XarticleInterface {
  @PrimaryGeneratedColumn()
  postID: number;

  @Index({ fulltext: true })
  @Column({ type: 'longtext', nullable: true })
  title: string;

  @Column({ type: 'longtext', nullable: true })
  detail: string;

  @Column({ type: 'text', nullable: true })
  voice: string;

  // 推荐等级为1的视为轮播图
  @Column({ type: 'int', nullable: true })
  recommendationLevel: number;

  @Column('int')
  score: number;

  @Column()
  scoreTxt: string;

  @Column('int')
  hit: number;

  @Column('int')
  commentCount: number;

  @Column('int')
  notice: number;

  @Column('int')
  weight: number;

  @Column('int')
  isGood: number;

  @Index()
  @Column('bigint')
  createTime: number;

  @Index()
  @Column('bigint')
  activeTime: number;

  @Column('int')
  line: number;

  @Index()
  @Column('int')
  tagid: number;

  @Column('int')
  status: number;

  @Column('int')
  praise: number;

  @Column('int')
  isAuthention: number;

  @Column('int')
  isRich: number;

  @Column('int')
  appOrientation: number;

  @Column('int')
  isAppPost: number;

  @Column('int')
  appSize: number;

  @Column('int')
  isGif: number;

  @OneToMany((type) => XimageEntity, (ximage) => ximage.article, {
    cascade: true,
    // cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
    // eager: true,
  })
  images: string[];

  @ManyToOne((type) => XuserEntity, (xuser) => xuser.articles, {
    cascade: false,
    onDelete: 'CASCADE',
    // eager: true,
  })
  user: XuserEntity;

  @OneToMany((type) => XpraiseEntity, (praise) => praise.posts)
  praiseId?: XpraiseEntity[];

  @OneToMany((type) => XcollectionEntity, (collection) => collection.posts)
  collectionId?: XcollectionEntity[];

  @OneToMany((type) => Xhistory, (collection) => collection.posts)
  historyId?: Xhistory[];
}
