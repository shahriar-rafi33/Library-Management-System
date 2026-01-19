import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from '../Admin/admin.entity';

@Entity('librarian_profiles')
export class LibrarianProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 255 })
  address?: string;

  @Column({ nullable: true, length: 255 })
  bio?: string;
}

@Entity('librarians')
export class LibrarianEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 200 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ length: 20 })
  phone: string;

  @Column('int')
  age: number;

  @Column({ length: 50, default: 'Librarian' })
  designation: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => LibrarianProfile, { cascade: true, eager: true, nullable: true })
  @JoinColumn()
  profile?: LibrarianProfile;

  @ManyToOne(() => Admin, (admin) => admin.librarians, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  supervisor?: Admin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
