import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class XPostsListStartEntity {
  @PrimaryGeneratedColumn()
  startID: number;

  @Column({ type: 'bigint' })
  start: number;
}
