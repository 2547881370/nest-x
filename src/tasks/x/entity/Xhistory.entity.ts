import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { XarticleEntity } from './Xarticle.entity';
import { XuserEntity } from './Xuser.entity';

@Entity()
export class Xhistory {
  @PrimaryGeneratedColumn()
  historyID: number;

  @Column('bigint')
  createTime: number;

  @ManyToOne((type) => XuserEntity, (xuser) => xuser.historyId, {
    onDelete: 'CASCADE',
  })
  user: XuserEntity;

  @ManyToOne((type) => XarticleEntity, (xarticle) => xarticle.historyId, {
    onDelete: 'CASCADE',
  })
  posts: XarticleEntity;
}
