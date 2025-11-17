import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Admin, AdminStatus } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async createAdmin(data: CreateAdminDto): Promise<Admin> {
    const dto = Object.assign(new CreateAdminDto(), data);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints ?? {}))
        .flat()
        .join(', ');
      throw new BadRequestException(messages);
    }

    const existingAdmin = await this.adminRepository.findOne({
      where: { email: data.email },
    });
    if (existingAdmin) {
      throw new BadRequestException('Email already exists!');
    }

    const newAdmin = this.adminRepository.create(data as Admin);
    return await this.adminRepository.save(newAdmin);
  }

  async getAllAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getAdminById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async updateAdmin(id: number, data: CreateAdminDto): Promise<Admin> {
    const admin = await this.getAdminById(id);

    if (data.email && data.email !== admin.email) {
      const emailExists = await this.adminRepository.findOne({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email already exists!');
      }
    }

    Object.assign(admin, data);
    return await this.adminRepository.save(admin);
  }

  async partialUpdateAdmin(
    id: number,
    data: Partial<CreateAdminDto>,
  ): Promise<Admin> {
    const admin = await this.getAdminById(id);

    if (data.email && data.email !== admin.email) {
      const emailExists = await this.adminRepository.findOne({
        where: { email: data.email },
      });
      if (emailExists) {
        throw new BadRequestException('Email already exists!');
      }
    }

    Object.assign(admin, data);
    return await this.adminRepository.save(admin);
  }

  async deleteAdmin(id: number): Promise<{ message: string }> {
    const admin = await this.getAdminById(id);
    await this.adminRepository.remove(admin);
    return { message: `Admin with ID ${id} deleted successfully` };
  }

  async assignRole(id: number, role: string): Promise<Admin> {
    const admin = await this.getAdminById(id);
    admin.role = role;
    return await this.adminRepository.save(admin);
  }

  async searchAdmins(name: string): Promise<Admin[]> {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .where('LOWER(admin.fullName) LIKE LOWER(:name)', {
        name: `%${name}%`,
      })
      .orWhere('LOWER(admin.email) LIKE LOWER(:name)', { name: `%${name}%` })
      .orderBy('admin.createdAt', 'DESC')
      .getMany();
  }
  
  async getInactiveAdmins(): Promise<Admin[]> {
    return await this.adminRepository.find({
      where: { status: AdminStatus.INACTIVE },
      order: { createdAt: 'ASC' },
    });
  }

  async changeStatus(id: number, status: AdminStatus): Promise<Admin> {
    const admin = await this.getAdminById(id);
    admin.status = status;
    return await this.adminRepository.save(admin);
  }

  async getAdminsOlderThan40(): Promise<Admin[]> {
    return await this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.age > :age', { age: 40 })
      .orderBy('admin.age', 'DESC')
      .addOrderBy('admin.createdAt', 'DESC')
      .getMany();
  }
}
