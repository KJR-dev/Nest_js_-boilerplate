import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ErrorLogModule } from './common/error-log/error-log.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggerModule } from './common/logger/logger.module';
import { PrismaModule } from './database/prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    LoggerModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URL,
        autoIndex: true,
        connectionFactory: (connection) => {
          console.log('💾 MongoDB connected');
          connection.on('disconnected', () => {
            console.log('💾 MongoDB Disconnected');
          });
          return connection;
        },
      }),
    }),
    ErrorLogModule,
    AuthModule,
    PrismaModule,
    UserModule,
    // ...other modules
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // GlobalExceptionFilter: UUID per error → Sentry tag → MongoDB (TTL 15d)
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      // 🔒 Global Authentication — all routes require JWT unless @Public()
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // 🛡️ Global Authorization — checks @Roles() decorator on protected routes
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
