import { CarClass } from 'src/entity/CarType';
import { Status, Transit } from 'src/entity/Transit';
import { AddressDTO } from './AddressDTO';
import { ClientDTO } from './ClientDTO';
import { DriverDTO } from './DriverDTO';

export class TransitDTO {
  private id: string;
  private distance: number;
  private factor: number | null;
  private price: number | null;
  private date: Date | null;
  private status: Status | null;
  private proposedDrivers: DriverDTO[];
  private to: AddressDTO;
  private from: AddressDTO;
  private carClass: CarClass;
  private clientDTO: ClientDTO;
  private driverFee: number | null;
  private estimatedPrice: number | null;
  private dateTime: Date | null;
  private published: Date | null;
  private acceptedAt: Date | null;
  private started: Date | null;
  private completeAt: Date | null;
  private kmRate: number;
  private tariff: string;

  constructor(transit: Transit) {
    this.id = transit.getId();
    this.distance = transit.getKm();
    this.factor = transit.factor;
    this.price = transit.getPrice() || null;
    this.date = transit.getDateTime();
    this.status = transit.getStatus();

    this.setTariff(transit);

    for (const driver of transit.getProposedDrivers()) {
      this.proposedDrivers.push(new DriverDTO(driver));
    }

    this.to = new AddressDTO(transit.getTo());
    this.from = new AddressDTO(transit.getFrom());
    this.carClass = transit.getCarType();
    this.clientDTO = new ClientDTO(transit.getClient());
    this.driverFee = transit.getDriversFee() || null;
    this.estimatedPrice = transit.getEstimatedPrice() || null;

    this.dateTime = transit.getDateTime();
    this.published = transit.getPublished();
    this.acceptedAt = transit.getAcceptedAt();
    this.started = transit.getStarted();
    this.completeAt = transit.getCompleteAt();
  }

  public getKmRate(): number {
    return this.kmRate;
  }

  private setTariff(transit: Transit): void {
    // TODO: finish it
  }

  public getTariff(): string {
    return this.tariff;
  }

  public getDistance(unit: string): string {
    // TODO: finish it

    return '';
  }
}
