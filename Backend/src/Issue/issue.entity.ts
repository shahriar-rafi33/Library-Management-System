import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Book } from '../Book/book.entity';

export enum IssueStatus {
  ISSUED = 'issued',
  RETURNED = 'returned',
}

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, { eager: true, onDelete: 'CASCADE' })
  book: Book;

  @Column({ length: 150 })
  borrowerName: string;

  @Column({ nullable: true, length: 200 })
  borrowerEmail?: string;

  @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.ISSUED })
  status: IssueStatus;

  @CreateDateColumn()
  issuedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt?: Date;
}
