import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { IssueService } from './issue.service';
import { IssueBookDto } from './dto/issue.dto';

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  list() {
    return this.issueService.listAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  issue(@Body() dto: IssueBookDto) {
    return this.issueService.issueBook(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/return')
  returnBook(@Param('id', ParseIntPipe) id: number) {
    return this.issueService.returnBook(id);
  }
}
