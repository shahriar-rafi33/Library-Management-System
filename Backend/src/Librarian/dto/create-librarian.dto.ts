import {
  IsEmail,
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  IsNumberString,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLibrarianDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumberString()
  phone: string;

  @IsInt()
  @Min(18)
  @Max(70)
  age: number;

  @IsString()
  designation: string;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateLibrarianDto extends PartialType(CreateLibrarianDto) {}

export class LoginLibrarianDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CreateLibrarianProfileDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
