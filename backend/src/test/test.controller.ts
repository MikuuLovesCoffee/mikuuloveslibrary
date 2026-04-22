import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';

@Controller('test')
export class TestController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async test() {
    return await this.prisma.role.findMany();
  }

  @Get('public')
  publicRoute() {
    return 'This is a public route';
  }
  @UseGuards(JwtGuard)
  @Get('protected')
  protectedRoute() {
    return 'This is a protected route';
  }
}
