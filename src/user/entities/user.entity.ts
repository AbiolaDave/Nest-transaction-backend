import { Transaction } from 'src/transactions/entity/transaction.entity.dto';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
    unique: true,
  })
  accountNumber: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  Date: Date

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 500 })
  balance: number;

  @OneToMany(() => Transaction, (tx) => tx.user)
  transactions: Transaction[];
}
