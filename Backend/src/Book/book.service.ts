import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async create(dto: CreateBookDto) {
    if (dto.isbn) {
      const exists = await this.bookRepo.findOne({ where: { isbn: dto.isbn } });
      if (exists) throw new BadRequestException('ISBN already exists');
    }

    const book = this.bookRepo.create({
      ...dto,
      availableCopies: dto.availableCopies ?? dto.totalCopies,
    });

    return this.bookRepo.save(book);
  }

  async findAll(q?: string, limit?: number) {
    const where = q
      ? [{ title: Like(`%${q}%`) }, { author: Like(`%${q}%`) }]
      : undefined;

    const books = await this.bookRepo.find({
      where: where as any,
      order: { createdAt: 'DESC' },
      take: limit ? Number(limit) : undefined,
    });

    return books;
  }

  async findOne(id: number) {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);

    if (dto.isbn && dto.isbn !== book.isbn) {
      const exists = await this.bookRepo.findOne({ where: { isbn: dto.isbn } });
      if (exists) throw new BadRequestException('ISBN already exists');
    }

    Object.assign(book, dto);
    return this.bookRepo.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
    return { message: `Book with id ${id} deleted` };
  }
}
