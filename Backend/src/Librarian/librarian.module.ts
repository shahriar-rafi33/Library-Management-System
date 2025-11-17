import { Module } from '@nestjs/common';
import { LibrarianController } from './librarian.controller';
import { LibrarianEntity } from './librarian.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrarianService } from './librarian.service';
@Module({
  imports: [TypeOrmModule.forFeature([LibrarianEntity]),],
  controllers: [LibrarianController],
  providers: [LibrarianService],
})
export class LibrarianModule {}
