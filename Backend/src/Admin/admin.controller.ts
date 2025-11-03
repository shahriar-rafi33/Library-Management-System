import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Post()
  createAdmin(@Body() data: CreateAdminDto) {
    return this.adminService.createAdmin(data);
  }

 
  @Get()
  getAllAdmins() {
    return this.adminService.getAllAdmins();
  }


  @Get(':id')
  getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(Number(id));
  }


  @Put(':id')
  updateAdmin(@Param('id') id: string, @Body() data: CreateAdminDto) {
    return this.adminService.updateAdmin(Number(id), data);
  }

  
  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() data: Partial<CreateAdminDto>) {
    return this.adminService.partialUpdateAdmin(Number(id), data);
  }


  @Delete(':id')
  deleteAdmin(@Param('id') id: string) {
    return this.adminService.deleteAdmin(Number(id));
  }


  @Patch(':id/role')
  assignRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.assignRole(Number(id), role);
  }

 
  @Get('search/name')
  searchAdmins(@Query('q') name: string) {
    return this.adminService.searchAdmins(name);
  }
}
