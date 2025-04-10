import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity.dto';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
  imports: [TypeOrmModule.forFeature([Transaction]), forwardRef(()=>UserModule)]
})
export class TransactionsModule {}