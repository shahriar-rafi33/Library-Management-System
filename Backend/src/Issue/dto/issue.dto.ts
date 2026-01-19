import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class IssueBookDto {
  @IsInt()
  @Min(1)
  bookId: number;

  @IsString()
  borrowerName: string;

  @IsOptional()
  @IsEmail()
  borrowerEmail?: string;
}
