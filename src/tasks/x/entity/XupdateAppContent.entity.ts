import { PrimaryGeneratedColumn, ManyToOne, Entity, Column } from 'typeorm';
import { XupdateAppEntity } from './XupdateApp.entity';

@Entity()
export class XupdateAppContentEntity {
  @PrimaryGeneratedColumn()
  updateAppContentId: number;

  @ManyToOne(
    (type) => XupdateAppEntity,
    (updateApp) => updateApp.updateAppContents,
    {
      onDelete: 'CASCADE',
    },
  )
  updateApp: XupdateAppEntity;

  @Column()
  content: string;
}
