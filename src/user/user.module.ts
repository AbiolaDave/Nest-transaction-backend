import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneUseByEmailProvider } from './providers/find-one-use-by-email.provider';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/transactions/entity/transaction.entity.dto';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserProvider,
    FindOneUseByEmailProvider,
    TransactionsService,
  ],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, Transaction]), // <-- Add Transaction here
    forwardRef(() => AuthModule),
    TransactionsModule,
  ],
})
export class UserModule {}

