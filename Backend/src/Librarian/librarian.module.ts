import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../Auth/auth.module';
import { LibrarianController } from './librarian.controller';
import { LibrarianService } from './librarian.service';
import { LibrarianEntity, LibrarianProfile } from './librarian.entity';
import { Admin } from '../Admin/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LibrarianEntity, LibrarianProfile, Admin]),
    AuthModule,
  ],
  controllers: [LibrarianController],
  providers: [LibrarianService],
  exports: [LibrarianService],
})
export class LibrarianModule {}
