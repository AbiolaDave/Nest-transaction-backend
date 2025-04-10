import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MakeDepositDto } from 'src/transactions/dtos/deposit.dto';
import { MakeWithdrawalDto } from 'src/transactions/dtos/withdrawal.dto';
import {
  Transaction,
  TransactionType,
} from 'src/transactions/entity/transaction.entity.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUseByEmailProvider } from './providers/find-one-use-by-email.provider';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly createUserProvider: CreateUserProvider,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    private readonly findOneByEmailProvider: FindOneUseByEmailProvider,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    return this.createUserProvider.create(createUserDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneByEmailProvider.findOneByEmail(email);
  }

  public async deposit(makeDepositDto: MakeDepositDto, user) {
    const registeredUser =
      await this.findOneByEmailProvider.findOneByEmail(user);

    if (!registeredUser) {
      throw new UnauthorizedException();
    }

    const amount = Number(makeDepositDto.amount);

    if (amount < 50) {
      throw new BadRequestException('Amount too small');
    }

    const newBalance = amount + Number(registeredUser.balance);
    registeredUser.balance = newBalance;

    try {
      await this.userRepository.save(registeredUser);

      await this.transactionRepository.save({
        type: TransactionType.DEPOSIT,
        amount,
        user: registeredUser,
        timestamp: new Date(),
      });

      return {
        message: 'Deposit successful',
        newBalance,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update user balance');
    }
  }

  public async withdraw(makeWithdrawalDto: MakeWithdrawalDto, user: any) {
    const registeredUser =
      await this.findOneByEmailProvider.findOneByEmail(user);

    if (!registeredUser) {
      throw new UnauthorizedException();
    }

    const amount = makeWithdrawalDto.amount;

    if (amount > registeredUser.balance) {
      throw new BadRequestException('Insufficient Funds');
    }

    const newBalance = registeredUser.balance - amount;
    registeredUser.balance = newBalance;

    try {
      await this.userRepository.save(registeredUser);

      await this.transactionRepository.save({
        type: TransactionType.WITHDRAWAL,
        amount,
        user: registeredUser,
        timestamp: new Date(),
      });
      return {
        message: 'Withdrawal successful',
        newBalance,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update user balance');
    }
  }

  public async transfer(makeTransferDto, user) {
    const registeredUser =
      await this.findOneByEmailProvider.findOneByEmail(user);

    if (!registeredUser) {
      throw new UnauthorizedException();
    }

    const amount = makeTransferDto.amount;

    if (amount > registeredUser.balance) {
      throw new BadRequestException('Insufficient Funds');
    }

    const existingReceiver = await this.userRepository.findOneBy({
      accountNumber: makeTransferDto.receiverAccontNumber,
    });

    if (!existingReceiver) {
      throw new BadRequestException('Receiver must be registered');
    }

    const newSenderBalance = Number(registeredUser.balance) - Number(amount);
    const newReceiverBalance =
      Number(existingReceiver.balance) + Number(amount);
    registeredUser.balance = newSenderBalance;
    existingReceiver.balance = newReceiverBalance;

    try {
      await this.userRepository.save(registeredUser).then(async () => {
        await this.userRepository.save(existingReceiver);
      });

      await this.transactionRepository.save({
        type: TransactionType.TRANSFER,
        amount,
        user: registeredUser,
        receiverId: existingReceiver.accountNumber,
        timestamp: new Date(),
      });

      return {
        message: 'Transfer successful',
        newSenderBalance,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update user balance');
    }
  }

  public async getTransactionHistory(user) {
    const registeredUser = await this.findOneByEmailProvider.findOneByEmail(
      user.email,
    );

    console.log('Decoded user:', user);
    console.log('Decoded user:', registeredUser);

    if (!registeredUser) {
      throw new UnauthorizedException();
    }

    return this.transactionRepository.find({
      where: { user: { id: registeredUser.id } },
      order: { timestamp: 'DESC' },
    });
  }
}
