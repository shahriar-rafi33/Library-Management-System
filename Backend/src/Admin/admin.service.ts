import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  private admins = [];

  createAdmin(data: CreateAdminDto) {
    const newAdmin = { id: Date.now(), ...data };
    this.admins.push(newAdmin);
    return { message: 'Admin created successfully', admin: newAdmin };
  }


  getAllAdmins() {
    return { message: 'All admins fetched', admins: this.admins };
  }


  getAdminById(id: number) {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) return { message: 'Admin not found' };
    return { message: 'Admin found', admin };
  }


  updateAdmin(id: number, data: CreateAdminDto) {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) return { message: 'Admin not found' };
    Object.assign(admin, data);
    return { message: 'Admin updated successfully', admin };
  }

 
  partialUpdateAdmin(id: number, data: Partial<CreateAdminDto>) {
    return this.updateAdmin(id, data as CreateAdminDto);
  }

  
  deleteAdmin(id: number) {
    this.admins = this.admins.filter(a => a.id !== id);
    return { message: 'Admin deleted successfully' };
  }


  assignRole(id: number, role: string) {
    const admin = this.admins.find(a => a.id === id);
    if (!admin) return { message: 'Admin not found' };
    admin.role = role;
    return { message: 'Role assigned successfully', admin };
  }


  searchAdmins(name: string) {
    const results = this.admins.filter(a =>
      a.name.toLowerCase().includes(name.toLowerCase()),
    );
    return { message: 'Search results', results };
  }
}
