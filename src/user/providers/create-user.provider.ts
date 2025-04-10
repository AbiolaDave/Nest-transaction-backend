import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    let existingUser: User | undefined;

    try {
      existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }

    if (existingUser) {
      console.log('Found existing user:', existingUser);
      throw new BadRequestException(
        'This user already exists, please check your email.',
      );
    }

    // Generate a unique account number
    let accountNumber: string;
    let exists: User | undefined;

    do {
      accountNumber = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString(); // 10-digit number
      exists = await this.userRepository.findOne({ where: { accountNumber } });
    } while (exists);

    console.log('DTO:', createUserDto);

    // Create and populate the new user entity
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashedPassword(
        createUserDto.password,
      ),
      accountNumber, // ✅ Don't forget this
    });

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error saving user to database',
        },
      );
    }

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }
}
