import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';


export class MakeWithdrawalDto {
  @ApiProperty({ example: 200 })
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  amount: number;

}
