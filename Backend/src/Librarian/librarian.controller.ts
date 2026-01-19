import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LibrarianService } from './librarian.service';
import {
  CreateLibrarianDto,
  UpdateLibrarianDto,
  LoginLibrarianDto,
  CreateLibrarianProfileDto,
} from './dto/create-librarian.dto';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';

@Controller('librarian')
export class LibrarianController {
  constructor(private readonly librarianService: LibrarianService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() dto: CreateLibrarianDto) {
    return this.librarianService.register(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: LoginLibrarianDto) {
    return this.librarianService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.librarianService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  search(@Query('q') q: string) {
    return this.librarianService.searchByName(q ?? '');
  }

  @UseGuards(JwtAuthGuard)
  @Get('phone/:phone')
  findByPhone(@Param('phone') phone: string) {
    return this.librarianService.getLibrarianByPhone(phone);
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.librarianService.findByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librarianService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLibrarianDto) {
    return this.librarianService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/active')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return this.librarianService.changeActiveStatus(id, isActive);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.librarianService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/profile')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  upsertProfile(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateLibrarianProfileDto) {
    return this.librarianService.upsertProfile(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/supervisor/:adminId')
  assignSupervisor(
    @Param('id', ParseIntPipe) id: number,
    @Param('adminId', ParseIntPipe) adminId: number,
  ) {
    return this.librarianService.assignSupervisor(id, adminId);
  }
}
