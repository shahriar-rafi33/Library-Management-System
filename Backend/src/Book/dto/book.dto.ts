import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsInt()
  @Min(1)
  totalCopies: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  availableCopies?: number;
}

export class UpdateBookDto extends PartialType(CreateBookDto) {}
