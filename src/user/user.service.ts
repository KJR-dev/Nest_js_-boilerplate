import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/RegisterUser.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  async getUserById(id: number) {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  async createUser(userData: RegisterUserDto) {
    return this.prismaService.user.create({ data: userData });
  }

  async getAllUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async clearRefreshToken(userId: number) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async updateUser(userId: number, userData: UpdateUserDto) {
    const updateData = await this.prismaService.user.update({
      where: { id: userId },
      data: userData,
    });
    const { password, refreshToken, ...safeUser } = updateData;

    return safeUser;
  }

  async deleteUser(userId: number) {
    return this.prismaService.user.delete({ where: { id: userId } });
  }
}
