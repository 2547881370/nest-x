import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { XupdateAppContentEntity } from './XupdateAppContent.entity';

@Entity()
export class XupdateAppEntity {
  @PrimaryGeneratedColumn()
  updateAppId: number;

  @Column()
  title: string;

  @Column()
  force: boolean;

  @OneToMany(
    (type) => XupdateAppContentEntity,
    (updateAppContent) => updateAppContent.updateApp,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  updateAppContents: XupdateAppContentEntity[];
}
