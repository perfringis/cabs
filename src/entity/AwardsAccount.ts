import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Client } from './Client';

@Entity()
export class AwardsAccount extends BaseEntity {
  @OneToOne(() => Client, { eager: true })
  @JoinColumn()
  private client: Client; // create clientId column

  @Column({ nullable: false, type: 'bigint', default: Date.now() })
  private date: number;

  @Column({ nullable: false, type: 'boolean' })
  private isActive: boolean;

  @Column({ nullable: false, default: 0 })
  private transactions: number;

  public getClient(): Client {
    return this.client;
  }

  public setClient(client: Client): void {
    this.client = client;
  }

  public getDate(): number {
    return this.date;
  }

  public setDate(date: number): void {
    this.date = date;
  }

  public isAwardActive(): boolean {
    return this.isActive;
  }

  public setActive(active: boolean) {
    this.isActive = active;
  }

  public getTransactions(): number {
    return this.transactions;
  }

  public increaseTransactions(): void {
    this.transactions++;
  }
}
