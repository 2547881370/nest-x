import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { XarticleEntity } from './Xarticle.entity';

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
}
