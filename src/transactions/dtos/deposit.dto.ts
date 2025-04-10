import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';


export class MakeDepositDto {
  @ApiProperty({ example: 200 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amount: number;

}
