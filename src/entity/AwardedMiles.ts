import { BaseEntity } from 'src/common/BaseEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Client } from './Client';
import { Transit } from './Transit';

@Entity()
export class AwardedMiles extends BaseEntity {
  // Aggregate
  // 1. mile celowo są osobno, aby się mogło rozjechać na ich wydawaniu -> docelowo: kolekcja VOs w agregacie
  // VO
  // 1. miles + expirationDate -> VO przykrywające logikę walidacji, czy nie przekroczono daty ważności punktów
  // 2. wydzielenie interfejsu Miles -> różne VO z różną logiką, np. ExpirableMiles, NonExpirableMiles, LinearExpirableMiles

  @ManyToOne(() => Client)
  public client: Client; // create clientId column

  @Column({ nullable: false, type: 'bigint' })
  private miles: number;

  @Column({ nullable: false, type: 'bigint', default: Date.now() })
  private date: number;

  @Column({ nullable: true, type: 'bigint' })
  private expirationDate: number | null;

  @Column({ nullable: true, type: 'boolean' })
  private isSpecial: boolean | null;

  // @ManyToOne(() => Transit, (transit) => transit.awardedMiles)
  // creates transitId column
  @ManyToOne(() => Transit)
  public transit: Transit | null; // create transitId column

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

  public getTransit(): Transit | null {
    return this.transit;
  }

  public setTransit(transit: Transit | null): void {
    this.transit = transit;
  }
}
