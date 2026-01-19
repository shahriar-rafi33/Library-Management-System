import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { LibrarianEntity } from '../Librarian/librarian.entity';
import { AdminProfile } from './admin.profile.entity';

export enum AdminStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  fullName: string;

  @Column({ unique: true, length: 200 })
  email: string;

  // ✅ security: do not return password in queries
  @Column({ select: false })
  password: string;

  @Column({ length: 20 })
  phone: string;

  @Column('int')
  age: number;

  @Column({ default: 'admin' })
  role: string;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.ACTIVE,
  })
  status: AdminStatus;

  @OneToOne(() => AdminProfile, (profile) => profile.admin, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  profile?: AdminProfile;

  @OneToMany(() => LibrarianEntity, (l) => l.supervisor)
  librarians: LibrarianEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
