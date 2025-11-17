import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AdminStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  fullName: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  gender: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phone: string;

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
  })
  age: number;

  @Column({
    type: 'enum',
    enum: AdminStatus,
    default: AdminStatus.ACTIVE,
  })
  status: AdminStatus;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  role?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}