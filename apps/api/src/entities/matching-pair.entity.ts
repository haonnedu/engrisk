import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Activity } from './activity.entity'

@Entity('matching_pairs')
export class MatchingPair {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  leftText!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  rightText!: string

  @Column({ type: 'boolean', default: true, nullable: false })
  shuffle!: boolean

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  // Relationships
  @ManyToOne(() => Activity, (activity) => activity.matchingPairs)
  @JoinColumn({ name: 'activityId' })
  activity!: Activity

  @Column({ type: 'uuid', nullable: false })
  activityId!: string
} 