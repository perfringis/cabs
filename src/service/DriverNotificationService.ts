import { Injectable } from '@nestjs/common';

@Injectable()
export class DriverNotificationService {
  public notifyAboutPossibleTransit(driverId: string, transitId: string): void {
    // ...
  }

  public notifyAboutChangedTransitAddress(
    driverId: string,
    transitId: string,
  ): void {
    // ...
  }

  public notifyAboutCancelledTransit(
    driverId: string,
    transitId: string,
  ): void {
    // ...
  }

  public askDriverForDetailsAboutClaim(
    claimNo: string,
    driverId: string,
  ): void {
    // ...
  }
}
