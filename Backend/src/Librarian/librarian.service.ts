import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LibrarianEntity, LibrarianProfile } from './librarian.entity';
import {
  CreateLibrarianDto,
  UpdateLibrarianDto,
  LoginLibrarianDto,
  CreateLibrarianProfileDto,
} from './dto/create-librarian.dto';
import { Admin } from '../Admin/admin.entity';

@Injectable()
export class LibrarianService {
  constructor(
    @InjectRepository(LibrarianEntity)
    private readonly librarianRepository: Repository<LibrarianEntity>,
    @InjectRepository(LibrarianProfile)
    private readonly profileRepository: Repository<LibrarianProfile>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  private sanitize(obj: any) {
    if (!obj) return obj;
    const { password, ...safe } = obj;
    return safe;
  }

  async register(dto: CreateLibrarianDto) {
    const existing = await this.librarianRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email is already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const librarian = this.librarianRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const saved = await this.librarianRepository.save(librarian);
    return this.sanitize(saved);
  }

  async login(dto: LoginLibrarianDto) {
    const librarian = await this.librarianRepository
      .createQueryBuilder('l')
      .addSelect('l.password')
      .where('l.email = :email', { email: dto.email })
      .getOne();

    if (!librarian) throw new HttpException('Invalid user', HttpStatus.UNAUTHORIZED);

    const ok = await bcrypt.compare(dto.password, librarian.password);
    if (!ok) throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);

    const payload = { sub: librarian.id, email: librarian.email, role: 'librarian' };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      role: 'librarian',
      id: librarian.id,
      fullName: `${librarian.firstName} ${librarian.lastName}`,
    };
  }

  async findAll() {
    return this.librarianRepository.find({
      relations: ['supervisor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: number) {
    const librarian = await this.librarianRepository.findOne({
      where: { id },
      relations: ['supervisor'],
    });
    if (!librarian) throw new NotFoundException(`Librarian with id ${id} not found`);
    return librarian;
  }

  async findByEmail(email: string) {
    const librarian = await this.librarianRepository.findOne({
      where: { email },
      relations: ['supervisor'],
    });
    if (!librarian) throw new NotFoundException(`Librarian with email "${email}" not found`);
    return librarian;
  }

  async getLibrarianByPhone(phone: string) {
    const librarian = await this.librarianRepository.findOne({ where: { phone } });
    if (!librarian) throw new NotFoundException(`Librarian not found for phone: ${phone}`);
    return librarian;
  }

  async update(id: number, dto: UpdateLibrarianDto) {
    const librarian = await this.findOneById(id);

    if (dto.email && dto.email !== librarian.email) {
      const exists = await this.librarianRepository.findOne({ where: { email: dto.email } });
      if (exists) throw new BadRequestException('Email is already registered');
    }

    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);

    Object.assign(librarian, dto);
    const saved = await this.librarianRepository.save(librarian);
    return this.sanitize(saved);
  }

  async changeActiveStatus(id: number, isActive: boolean) {
    const librarian = await this.findOneById(id);
    librarian.isActive = isActive;
    return this.librarianRepository.save(librarian);
  }

  async remove(id: number) {
    const librarian = await this.findOneById(id);
    await this.librarianRepository.remove(librarian);
    return { message: `Librarian with id ${id} deleted` };
  }

  async searchByPhone(phone: string) {
    const q = `%${phone}%`;
    return this.librarianRepository
      .createQueryBuilder('l')
      .where('l.phone LIKE :phone', { phone: q })
      .getMany();
  }

  async searchByName(name: string) {
    const q = `%${name}%`;
    return this.librarianRepository
      .createQueryBuilder('l')
      .where('LOWER(l.firstName) LIKE LOWER(:name)', { name: q })
      .orWhere('LOWER(l.lastName) LIKE LOWER(:name)', { name: q })
      .getMany();
  }

  async upsertProfile(librarianId: number, dto: CreateLibrarianProfileDto) {
    const librarian = await this.findOneById(librarianId);

    if (librarian.profile) {
      librarian.profile.address = dto.address ?? librarian.profile.address;
      librarian.profile.bio = dto.bio ?? librarian.profile.bio;
      await this.profileRepository.save(librarian.profile);
    } else {
      const profile = this.profileRepository.create(dto);
      await this.profileRepository.save(profile);
      librarian.profile = profile;
    }

    return this.librarianRepository.save(librarian);
  }

  async assignSupervisor(librarianId: number, adminId: number) {
    const librarian = await this.findOneById(librarianId);
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException(`Admin with id ${adminId} not found`);

    librarian.supervisor = admin;
    return this.librarianRepository.save(librarian);
  }
}
