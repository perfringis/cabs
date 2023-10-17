import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { Client } from './Client';
import { Transit } from './Transit';

@Entity({ name: 'awarded_miles' })
export class AwardedMiles extends BaseEntity {
  // Aggregate
  // 1. mile celowo są osobno, aby się mogło rozjechać na ich wydawaniu -> docelowo: kolekcja VOs w agregacie

  // VO
  // 1. miles + expirationDate -> VO przykrywające logikę walidacji, czy nie przekroczono daty ważności punktów
  // 2. wydzielenie interfejsu Miles -> różne VO z różną logiką, np. ExpirableMiles, NonExpirableMiles, LinearExpirableMiles

  @Column({ name: 'miles', nullable: false, type: 'int' })
  private miles: number;

  @Column({
    nullable: false,
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  private date: Date;

  @Column({ name: 'expiration_date', nullable: true, type: 'datetime' })
  private expirationDate: Date | null;

  @Column({ name: 'is_special', nullable: true, type: 'bit' })
  private isSpecial: boolean | null;

  @ManyToOne(() => Transit, (transit) => transit)
  @JoinColumn({ name: 'transit_id' })
  public transit: Transit;

  @ManyToOne(() => Client, (client) => client)
  @JoinColumn({ name: 'client_id' })
  public client: Client;

  @VersionColumn({ type: 'int', nullable: true })
  private version: number | null;

  public getMiles(): number {
    return this.miles;
  }

  public setMiles(miles: number): void {
    this.miles = miles;
  }

  public getDate(): Date {
    return this.date;
  }

  public setDate(date: Date): void {
    this.date = date;
  }

  public getExpirationDate(): Date | null {
    return this.expirationDate;
  }

  public setExpirationDate(expirationDate: Date): void {
    this.expirationDate = expirationDate;
  }

  public getIsSpecial(): boolean | null {
    return this.isSpecial;
  }

  public setSpecial(isSpecial: boolean): void {
    this.isSpecial = isSpecial;
  }

  public getTransit(): Transit {
    return this.transit;
  }

  public setTransit(transit: Transit): void {
    this.transit = transit;
  }

  public getClient(): Client {
    return this.client;
  }

  public setClient(client: Client): void {
    this.client = client;
  }
}
