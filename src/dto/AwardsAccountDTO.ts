import { AwardsAccount } from 'src/entity/AwardsAccount';
import { ClientDTO } from './ClientDTO';

export class AwardsAccountDTO {
  public date: Date;
  public isActive: boolean;
  public transactions: number;
  public client: ClientDTO;

  constructor(account: AwardsAccount) {
    this.date = account.getDate();
    this.isActive = account.getIsActive();
    this.transactions = account.getTransactions();
    this.client = new ClientDTO(account.getClient());
  }

  public getDate(): Date {
    return this.date;
  }

  public setDate(date: Date): void {
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

  public setTransactions(transactions: number): void {
    this.transactions = transactions;
  }

  public getClient(): ClientDTO {
    return this.client;
  }

  public setClient(client: ClientDTO): void {
    this.client = client;
  }
}
