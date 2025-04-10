import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import jwtConfig from '../config/jwt.config';
import { SignInDto } from '../dtos/singin.dto';
import { HashingProvider } from './hashing.provider';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    private readonly hashingProvider: HashingProvider,

    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signIn(signInDto: SignInDto) {
    let user = await this.userService.findOneByEmail(signInDto.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Failed to authenticate user',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Wrong Password');
    }

    console.log('JWT Secret:', this.jwtConfiguration.secret);
    console.log('JWT Secret:', this.jwtConfiguration.audience);
    console.log('JWT Secret:', this.jwtConfiguration.issuer);
    console.log('JWT Secret:', this.jwtConfiguration.accessTokenTttl);

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTttl,
      },
    );

    return {
      accessToken,
    };
  }
}
