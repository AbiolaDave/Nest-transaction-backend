import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class MakeTransferDto {
  @ApiProperty({ example: 200 })
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  amount: number;

  @ApiProperty({ example: 1222222 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  receiverAccontNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  receiverName: string;
}
