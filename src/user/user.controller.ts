import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-users.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { MakeDepositDto } from 'src/transactions/dtos/deposit.dto';
import { MakeWithdrawalDto } from 'src/transactions/dtos/withdrawal.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { MakeTransferDto } from 'src/transactions/dtos/transfer.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  // @SetMetadata("authType", "none")
  @Auth(AuthType.None)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('withdraw')
  public makeWithdrawal(
    @Body() makeWithdrawalDto: MakeWithdrawalDto,
    @ActiveUser('email') user: ActiveUserData,
  ) {
    return this.userService.withdraw(makeWithdrawalDto, user);
  }

  @Post('deposit')
  public makeDeposit(
    @Body() makeDepositDto: MakeDepositDto,
    @ActiveUser('email') user: ActiveUserData,
  ) {
    return this.userService.deposit(makeDepositDto, user);
  }

  @Post('transfer')
  public makeTransfer(
    @Body() makeTransferDto: MakeTransferDto,
    @ActiveUser('email') user: ActiveUserData,
  ) {
    return this.userService.transfer(makeTransferDto, user);
  }

  @Post('history')
  public getTransactionHistory(@ActiveUser('email') email: string) {
    return this.userService.getTransactionHistory({ email });
  }
}
