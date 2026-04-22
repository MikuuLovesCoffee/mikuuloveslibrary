/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  jwt: any;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const userRole = await this.prisma.role.findUnique({
      where: { name: 'User' },
    });
    if (!userRole) {
      throw new Error('User role not found');
    } // this is for userRole not get might be null
    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
        roleId: userRole.id,
        isApproved: true,
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const role = await this.prisma.role.findUnique({
      where: { id: user.roleId },
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: role?.name,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      return {
        accessToken: this.jwtService.sign(
          {
            id: payload.id,
            email: payload.email,
            role: payload.role,
          },
          { expiresIn: '15m' },
        ),
      };
    } catch {
      throw new Error('Invalid refresh token');
    }
  }
}
