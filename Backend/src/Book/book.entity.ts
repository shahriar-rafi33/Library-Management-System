import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 150 })
  author: string;

  @Column({ nullable: true, unique: true })
  isbn?: string;

  @Column({ nullable: true, length: 100 })
  category?: string;

  @Column({ type: 'int', default: 1 })
  totalCopies: number;

  @Column({ type: 'int', default: 1 })
  availableCopies: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
