import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from '../Book/book.entity';
import { Issue, IssueStatus } from './issue.entity';
import { IssueBookDto } from './dto/issue.dto';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepo: Repository<Issue>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async issueBook(dto: IssueBookDto) {
    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');

    if (book.availableCopies <= 0) {
      throw new BadRequestException('No available copies');
    }

    book.availableCopies -= 1;
    await this.bookRepo.save(book);

    const issue = this.issueRepo.create({
      book,
      borrowerName: dto.borrowerName,
      borrowerEmail: dto.borrowerEmail,
      status: IssueStatus.ISSUED,
    });

    return this.issueRepo.save(issue);
  }

  async listAll() {
    return this.issueRepo.find({ order: { issuedAt: 'DESC' } });
  }

  async returnBook(issueId: number) {
    const issue = await this.issueRepo.findOne({ where: { id: issueId } });
    if (!issue) throw new NotFoundException('Issue record not found');

    if (issue.status === IssueStatus.RETURNED) {
      throw new BadRequestException('Already returned');
    }

    issue.status = IssueStatus.RETURNED;
    issue.returnedAt = new Date();
    await this.issueRepo.save(issue);

    // increase available copies
    const book = await this.bookRepo.findOne({ where: { id: issue.book.id } });
    if (book) {
      book.availableCopies += 1;
      await this.bookRepo.save(book);
    }

    return issue;
  }
}
