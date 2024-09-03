import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientNotificationService {
  public notifyClientAboutRefund(claimNo: string, clientId: string): void {
    // TODO
  }

  public askForMoreInformation(claimNo: string, clientId: string): void {
    // TODO
  }
}
