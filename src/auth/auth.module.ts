import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import jwtConfig from './config/jwt.config';
import { BcryptProvider } from './providers/bcrypt.provider';
import { HashingProvider } from './providers/hashing.provider';
import { SignInProvider } from './providers/sign-in.provider';
// import jwtConfig, { jwtConfigKey } from './config/jwt.config';
import jwtConfig, { jwtConfigKey } from './config/jwt.config';


@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
  ],
  imports: [
    forwardRef(() => UserModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const jwt = configService.get(jwtConfigKey); 
        return {
          secret: jwt.secret,
          signOptions: {
            expiresIn: jwt.accessTokenTttl,
            audience: jwt.audience,
            issuer: jwt.issuer,
          },
        };
      },
    }),
  ],
  exports: [AuthService, HashingProvider],
})
export class AuthModule {}
