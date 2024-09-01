import { Injectable } from '@nestjs/common';

@Injectable()
export class AppProperties {
  private noOfTransitsForClaimAutomaticRefund: number;
  private automaticRefundForVipThreshold: number;
  private minNoOfCarsForEcoClass: number;

  private milesExpirationInDays = 365;
  private defaultMilesBonus = 10;

  public getAutomaticRefundForVipThreshold(): number {
    return this.automaticRefundForVipThreshold;
  }

  public setAutomaticRefundForVipThreshold(
    automaticRefundForVipThreshold: number,
  ): void {
    this.automaticRefundForVipThreshold = automaticRefundForVipThreshold;
  }

  public getNoOfTransitsForClaimAutomaticRefund(): number {
    return this.noOfTransitsForClaimAutomaticRefund;
  }

  public setNoOfTransitsForClaimAutomaticRefund(
    noOfTransitsForClaimAutomaticRefund: number,
  ): void {
    this.noOfTransitsForClaimAutomaticRefund =
      noOfTransitsForClaimAutomaticRefund;
  }

  public getMinNoOfCarsForEcoClass(): number {
    return this.minNoOfCarsForEcoClass;
  }

  public setMinNoOfCarsForEcoClass(minNoOfCarsForEcoClass: number): void {
    this.minNoOfCarsForEcoClass = minNoOfCarsForEcoClass;
  }

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
