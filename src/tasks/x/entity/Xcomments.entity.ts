import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { XdetailedEntity } from './Xdetailed.entity';
import { XimageEntity } from './Ximage.entity';
import { XuserEntity } from './Xuser.entity';

@Entity()
export class XcommentsEntity {
  @PrimaryGeneratedColumn()
  commentID: number;

  @Column({ type: 'varchar' })
  text: string;

  @OneToMany((type) => XimageEntity, (ximage) => ximage.comments, {
    cascade: true,
    // cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  images: string[];

  @Column()
  voice: string;

  @Column()
  voiceTime: number;

  @Column()
  score: number;

  @Column()
  scoreTxt: string;

  @Column()
  seq: number;

  @Column('bigint')
  createTime: number;

  @Column()
  state: number;

  @ManyToOne(() => XuserEntity, (user) => user.postComment, {
    cascade: true,
    // cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  user: XuserEntity;

  @Column()
  scoreUserCount: number;

  @Column()
  scorecount: number;

  @Column()
  praise: number;

  @ManyToOne((type) => XdetailedEntity, (detailed) => detailed.comments, {
    onDelete: 'CASCADE',
  })
  posts: XdetailedEntity;
}
