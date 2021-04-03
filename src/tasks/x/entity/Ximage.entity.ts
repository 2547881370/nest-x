import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { XarticleEntity } from './Xarticle.entity';
import { XcommentsEntity } from './Xcomments.entity';

@Entity()
export class XimageEntity {
  @PrimaryGeneratedColumn()
  imgId: number;

  @Column()
  url: string;

  @ManyToOne((type) => XarticleEntity, (xarticle) => xarticle.images, {
    onDelete: 'CASCADE',
  })
  article: XarticleEntity;

  @ManyToOne((type) => XcommentsEntity, (comments) => comments.images, {
    onDelete: 'CASCADE',
  })
  comments: XcommentsEntity;
}
