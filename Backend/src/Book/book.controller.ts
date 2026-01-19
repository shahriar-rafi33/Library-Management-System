import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // ✅ Public SSR-friendly endpoints
  @Get()
  findAll(@Query('q') q?: string, @Query('limit') limit?: string) {
    return this.bookService.findAll(q, limit ? Number(limit) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  // ✅ Protected create/update/delete
  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
