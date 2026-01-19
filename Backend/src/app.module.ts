import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AdminModule } from './Admin/admin.module';
import { LibrarianModule } from './Librarian/librarian.module';
// (Optional – only if you have these modules)
import { BookModule } from './Book/book.module';
import { IssueModule } from './Issue/issue.module';

@Module({
  imports: [
    // ✅ Database Configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '3318',
      database: 'Library',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // ✅ Feature Modules
    AdminModule,
    LibrarianModule,
    BookModule,
    IssueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
