import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Activity } from './activity.entity'

@Entity('fill_blanks')
export class FillBlank {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  word!: string

  @Column({ type: 'text', nullable: true })
  hint?: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  // Relationships
  @ManyToOne(() => Activity, (activity) => activity.fillBlanks)
  @JoinColumn({ name: 'activityId' })
  activity!: Activity

  @Column({ type: 'uuid', nullable: false })
  activityId!: string
} 