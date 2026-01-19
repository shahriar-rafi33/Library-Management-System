import {
  IsEmail,
  IsString,
  MinLength,
  IsNumberString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsIn,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { AdminStatus } from '../admin.entity';

export class CreateAdminDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNumberString()
  phone: string;

  @IsInt()
  @Min(18)
  @Max(80)
  age: number;

  @IsOptional()
  @IsIn(['admin', 'librarian'])
  role?: string;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: AdminStatus;
}

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}

export class LoginAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CreateAdminProfileDto {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
