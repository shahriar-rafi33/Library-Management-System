import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { Admin, AdminStatus } from './admin.entity';
import { LibrarianEntity } from '../Librarian/librarian.entity';
import {
  CreateAdminDto,
  UpdateAdminDto,
  LoginAdminDto,
  CreateAdminProfileDto,
} from './dto/create-admin.dto';
import { AdminProfile } from './admin.profile.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(AdminProfile)
    private readonly profileRepository: Repository<AdminProfile>,
    @InjectRepository(LibrarianEntity)
    private readonly librarianRepository: Repository<LibrarianEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitize(admin: any) {
    if (!admin) return admin;
    const { password, ...safe } = admin;
    return safe;
  }

  async register(dto: CreateAdminDto) {
    const existing = await this.adminRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email is already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const admin = this.adminRepository.create({
      ...dto,
      password: hashedPassword,
      role: dto.role ?? 'admin',
      status: dto.status ?? AdminStatus.ACTIVE,
    });

    const saved = await this.adminRepository.save(admin);
    return this.sanitize(saved);
  }

  async login(dto: LoginAdminDto) {
    // password is select:false, so we must explicitly add it
    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.email = :email', { email: dto.email })
      .getOne();

    if (!admin) throw new HttpException('Invalid Email', HttpStatus.UNAUTHORIZED);

    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) throw new HttpException('Invalid Password', HttpStatus.UNAUTHORIZED);

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      role: admin.role,
      id: admin.id,
      fullName: admin.fullName,
    };
  }

  async findAll(status?: AdminStatus) {
    const options: any = {
      relations: ['profile', 'librarians'],
      order: { createdAt: 'DESC' },
    };
    if (status) options.where = { status };
    return this.adminRepository.find(options);
  }

  async findOneById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['profile', 'librarians'],
    });
    if (!admin) throw new NotFoundException(`Admin with id ${id} not found`);
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.findOneById(id);

    if (dto.email && dto.email !== admin.email) {
      const exists = await this.adminRepository.findOne({ where: { email: dto.email } });
      if (exists) throw new BadRequestException('Email is already registered');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(admin, dto);
    const saved = await this.adminRepository.save(admin);
    return this.sanitize(saved);
  }

  async changeStatus(id: number, status: AdminStatus) {
    const admin = await this.findOneById(id);
    admin.status = status;
    return this.adminRepository.save(admin);
  }

  async remove(id: number) {
    const admin = await this.findOneById(id);
    await this.adminRepository.remove(admin);
    return { message: `Admin with id ${id} deleted` };
  }

  async searchByName(name: string) {
    return this.adminRepository.find({
      where: { fullName: Like(`%${name}%`) },
    });
  }

  async upsertProfile(adminId: number, dto: CreateAdminProfileDto) {
    const admin = await this.findOneById(adminId);

    if (admin.profile) {
      admin.profile.address = dto.address ?? admin.profile.address;
      admin.profile.bio = dto.bio ?? admin.profile.bio;
      await this.profileRepository.save(admin.profile);
    } else {
      const profile = this.profileRepository.create({ ...dto, admin });
      await this.profileRepository.save(profile);
      admin.profile = profile;
    }

    return this.adminRepository.save(admin);
  }

  async getProfile(adminId: number) {
    const admin = await this.findOneById(adminId);
    return admin.profile ?? null;
  }

  async deleteProfile(adminId: number) {
    const admin = await this.findOneById(adminId);
    if (admin.profile) {
      await this.profileRepository.remove(admin.profile);
      admin.profile = undefined;
      await this.adminRepository.save(admin);
    }
  }

  async getLibrariansForAdmin(adminId: number) {
    await this.findOneById(adminId);
    return this.librarianRepository.find({
      where: { supervisor: { id: adminId } },
      relations: ['supervisor', 'profile'],
    });
  }

  async assignLibrarian(adminId: number, librarianId: number) {
    const admin = await this.findOneById(adminId);

    const librarian = await this.librarianRepository.findOne({
      where: { id: librarianId },
      relations: ['supervisor', 'profile'],
    });
    if (!librarian) throw new NotFoundException(`Librarian with id ${librarianId} not found`);

    librarian.supervisor = admin;
    return this.librarianRepository.save(librarian);
  }
}
