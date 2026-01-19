import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { Book } from '../Book/book.entity';
import { Issue } from './issue.entity';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Book]), AuthModule],
  controllers: [IssueController],
  providers: [IssueService],
})
export class IssueModule {}
