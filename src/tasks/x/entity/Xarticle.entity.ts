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

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  detail: string;

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
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: XuserEntity;
}
