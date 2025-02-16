import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true, default: () => 'CURRENT_DATE' })
  visit_date: string;

  @Column({ type: 'int', default: 0 })
  visit_count: number;
}
