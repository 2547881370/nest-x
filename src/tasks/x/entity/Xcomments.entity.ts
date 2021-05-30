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

  @Column({ type: 'varchar', nullable: true })
  text: string;

  @OneToMany((type) => XimageEntity, (ximage) => ximage.comments, {
    cascade: true,
    // cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  images?: string[];

  @Column({ nullable: true })
  voice: string;

  @Column({ nullable: true })
  voiceTime: number;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  scoreTxt: string;

  @Column({ nullable: true })
  seq: number;

  @Column('bigint')
  createTime: number;

  @Column({ nullable: true })
  state: number;

  @ManyToOne(() => XuserEntity, (user) => user.postComment, {
    cascade: true,
    // cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  user: XuserEntity;

  @Column({ nullable: true })
  scoreUserCount: number;

  @Column({ nullable: true })
  scorecount: number;

  @Column({ nullable: true })
  praise: number;

  @ManyToOne((type) => XdetailedEntity, (detailed) => detailed.comments, {
    onDelete: 'CASCADE',
  })
  posts: XdetailedEntity;
}
