import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './auth/config/jwt.config';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [],
      useFactory: () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'Abiola',
        password: 'Dynamind2494',
        database: 'test_db',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),

    UserModule,
    AuthModule,
    TransactionsModule,
  ],
  providers: [
     {
          provide: APP_GUARD,
          useClass: AuthenticationGuard,
        },
        AccessTokenGuard,
  ]
})
export class AppModule {}
