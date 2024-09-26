import { DriverAttributeDTO } from './DriverAttributeDTO';
import { DriverDTO } from './DriverDTO';
import { DriverSessionDTO } from './DriverSessionDTO';
import { TransitDTO } from './TransitDTO';

export class DriverReport {
  public driverDTO: DriverDTO;
  public attributes: DriverAttributeDTO[];
  public sessions: Map<DriverSessionDTO, TransitDTO[]> = new Map();

  public getDriverDTO(): DriverDTO {
    return this.driverDTO;
  }

  public setDriverDTO(driverDTO: DriverDTO): void {
    this.driverDTO = driverDTO;
  }

  public getAttributes(): DriverAttributeDTO[] {
    return this.attributes;
  }

  public setAttributes(attributes: DriverAttributeDTO[]): void {
    this.attributes = attributes;
  }

  public getSessions(): Map<DriverSessionDTO, TransitDTO[]> {
    return this.sessions;
  }

  public setSessions(sessions: Map<DriverSessionDTO, TransitDTO[]>): void {
    this.sessions = sessions;
  }
}
