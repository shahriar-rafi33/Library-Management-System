import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../Auth/auth.module';
import { Book } from './book.entity';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthModule],
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
