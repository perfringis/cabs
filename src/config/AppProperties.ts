import { Injectable } from '@nestjs/common';

@Injectable()
export class AppProperties {
  private milesExpirationInDays = 365;
  private defaultMilesBonus = 10;

  public getMilesExpirationInDays(): number {
    return this.milesExpirationInDays;
  }

  public setMilesExpirationInDays(milesExpirationInDays: number): void {
    this.milesExpirationInDays = milesExpirationInDays;
  }

  public getDefaultMilesBonus(): number {
    return this.defaultMilesBonus;
  }

  public setDefaultMilesBonus(defaultMilesBonus: number): void {
    this.defaultMilesBonus = defaultMilesBonus;
  }
}
