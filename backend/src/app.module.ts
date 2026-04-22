import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { TestModule } from './test/test.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { CommentModule } from './comment/comment.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TestModule,
    PrismaModule,
    AuthModule,
    BookModule,
    CommentModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
