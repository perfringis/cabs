import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Client } from './Client';
import { Transit } from './Transit';

@Entity({ name: 'awarded_miles' })
export class AwardedMiles extends BaseEntity {
  @Column({ nullable: false, type: 'bigint' })
  private miles: number;

  @Column({ nullable: false, type: 'bigint', default: Date.now() })
  private date: number;

  @Column({ nullable: true, type: 'bigint' })
  private expirationDate: number | null;

  @Column({ nullable: true, type: 'boolean' })
  private isSpecial: boolean | null;

  @ManyToOne(() => Transit, (transit) => transit)
  public transit: Transit;

  @ManyToOne(() => Client, (client) => client)
  public client: Client;

  public getClient(): Client {
    return this.client;
  }

  public setClient(client: Client): void {
    this.client = client;
  }

  public getMiles(): number {
    return this.miles;
  }

  public setMiles(miles: number): void {
    this.miles = miles;
  }

  public getDate(): number {
    return this.date;
  }

  public setDate(date: number): void {
    this.date = date;
  }

  public getExpirationDate(): number | null {
    return this.expirationDate;
  }

  public setExpirationDate(expirationDate: number | null): void {
    this.expirationDate = expirationDate;
  }

  public isAwardedMilesSpecial(): boolean | null {
    return this.isSpecial;
  }

  public setSpecial(special: boolean | null): void {
    this.isSpecial = special;
  }

  public getTransit(): Transit {
    return this.transit;
  }

  public setTransit(transit: Transit): void {
    this.transit = transit;
  }
}
