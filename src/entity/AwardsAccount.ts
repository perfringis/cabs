import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Client } from './Client';

@Entity({ name: 'awards_account' })
export class AwardsAccount extends BaseEntity {
  @Column({ nullable: false, type: 'bigint', default: Date.now() })
  private date: number;

  @Column({ name: 'is_active', nullable: false, type: 'boolean' })
  private isActive: boolean;

  @Column({ nullable: false, type: 'int', default: 0 })
  private transactions: number;

  @OneToOne(() => Client, (client) => client, { eager: true })
  @JoinColumn({ name: 'client_id' })
  private client: Client;

  public getDate(): number {
    return this.date;
  }

  public setDate(date: number): void {
    this.date = date;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public getTransactions(): number {
    return this.transactions;
  }

  public increaseTransactions(transactions: number): void {
    this.transactions++;
  }

  public getClient(): Client {
    return this.client;
  }

  public setClient(client: Client): void {
    this.client = client;
  }
}
