import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { XimageEntity } from './Ximage.entity';
import { XuserEntity } from './Xuser.entity';
import { XarticleInterface } from '../interface/xarticle.interface';

@Entity()
export class XarticleEntity implements XarticleInterface {
  @PrimaryGeneratedColumn()
  postID: number;

  @Column({ type: 'varchar', length: 8000 })
  title: string;

  @Column({ type: 'varchar', length: 8000 })
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

  @Column('bigint')
  createTime: number;

  @Column('bigint')
  activeTime: number;

  @Column('int')
  line: number;

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
  })
  images: string[];

  @ManyToOne((type) => XuserEntity, (xuser) => xuser.articles, {
    cascade: false,
    onDelete: 'CASCADE',
  })
  user: XuserEntity;
}
