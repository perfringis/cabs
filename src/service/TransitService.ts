import { ClientRepository } from 'src/repository/ClientRepository';
import { DriverRepository } from 'src/repository/DriverRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { InvoiceGenerator } from './InvoiceGenerator';
import { DriverNotificationService } from './DriverNotificationService';
import { DistanceCalculator } from './DistanceCalculator';
import { DriverPositionRepository } from 'src/repository/DriverPositionRepository';
import { DriverSessionRepository } from 'src/repository/DriverSessionRepository';
import { CarTypeService } from './CarTypeService';
import { GeocodingService } from './GeocodingService';
import { AddressRepository } from 'src/repository/AddressRepository';
import { DriverFeeService } from './DriverFeeService';
import { AwardsService } from './AwardsService';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Status, Transit } from 'src/entity/Transit';
import { Address } from 'src/entity/Address';
import { AddressDTO } from 'src/dto/AddressDTO';
import { CarClass } from 'src/entity/CarType';
import { Client } from 'src/entity/Client';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';

export class TransitService {
  constructor(
    private driverRepository: DriverRepository,
    private transitRepository: TransitRepository,
    private clientRepository: ClientRepository,
    private invoiceGenerator: InvoiceGenerator,
    private notificationService: DriverNotificationService,
    private distanceCalculator: DistanceCalculator,
    private driverPositionRepository: DriverPositionRepository,
    private driverSessionRepository: DriverSessionRepository,
    private carTypeService: CarTypeService,
    private geocodingService: GeocodingService,
    private addressRepository: AddressRepository,
    private driverFeeService: DriverFeeService,
    private awardsService: AwardsService,
  ) {}

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  public async createTransit(transitDTO: TransitDTO): Promise<Transit> {
    const from: Address = await this.addressFromDto(transitDTO.getFrom());
    const to: Address = await this.addressFromDto(transitDTO.getTo());

    return await this._createTransit(
      transitDTO.getClientDTO().getId(),
      from,
      to,
      transitDTO.getCarClass(),
    );
  }

  private async addressFromDto(addressDTO: AddressDTO): Promise<Address> {
    const address: Address = addressDTO.toAddressEntity();
    return await this.addressRepository.save(address);
  }

  public async _createTransit(
    clientId: string,
    from: Address,
    to: Address,
    carClass: CarClass,
  ): Promise<Transit> {
    const client: Client = await this.clientRepository.getOne(clientId);

    if (client === null) {
      throw new NotFoundException('Client does not exist, id = ' + clientId);
    }

    const transit: Transit = new Transit();

    // FIXME later: add some exceptions handling
    const geoFrom: number[] = this.geocodingService.geocodeAddress(from);
    const geoTo: number[] = this.geocodingService.geocodeAddress(to);

    transit.setClient(client);
    transit.setFrom(from);
    transit.setTo(to);
    transit.setCarType(carClass);
    transit.setStatus(Status.DRAFT);
    transit.setDateTime(dayjs().toDate());
    transit.setKm(
      this.distanceCalculator.calculateByMap(
        geoFrom[0],
        geoFrom[1],
        geoTo[0],
        geoTo[1],
      ),
    );

    return await this.transitRepository.save(transit);
  }

  public async _changeTransitAddressFrom(
    transitId: string,
    newAddress: Address,
  ): Promise<void> {
    newAddress = await this.addressRepository.save(newAddress);
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    // FIXME later: add some exceptions handling
    const geoFromNew: number[] = await this.geocodingService.geocodeAddress(
      newAddress,
    );
    const geoFromOld: number[] = await this.geocodingService.geocodeAddress(
      transit.getFrom(),
    );

    // https://www.geeksforgeeks.org/program-distance-two-points-earth/
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    const lon1: number = this.toRadians(geoFromNew[1]);
    const lon2: number = this.toRadians(geoFromOld[1]);
    const lat1: number = this.toRadians(geoFromNew[0]);
    const lat2: number = this.toRadians(geoFromOld[0]);

    // Haversine formula
    const dlon: number = lon2 - lon1;
    const dlat: number = lat2 - lat1;

    const a: number =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    const c: number = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956 for miles
    const r = 6371;

    // calculate the result
    const distanceInKMeters = c * r;

    if (
      !(transit.getStatus() === Status.DRAFT) ||
      transit.getStatus() === Status.WAITING_FOR_DRIVER_ASSIGNMENT ||
      transit.getPickupAddressChangeCounter() > 2 ||
      distanceInKMeters > 0.25
    ) {
      throw new NotAcceptableException(
        "Address 'from' cannot be changed, id = " + transitId,
      );
    }

    transit.setFrom(newAddress);
    transit.setKm(
      this.distanceCalculator.calculateByMap(
        geoFromNew[0],
        geoFromNew[1],
        geoFromOld[0],
        geoFromOld[1],
      ),
    );
    transit.setPickupAddressChangeCounter(
      transit.getPickupAddressChangeCounter() + 1,
    );

    await this.transitRepository.save(transit);

    for (const driver of transit.getProposedDrivers()) {
      this.notificationService.notifyAboutChangedTransitAddress(
        driver.getId(),
        transitId,
      );
    }
  }

  public async changeTransitAddressTo(
    transitId: string,
    newAddress: AddressDTO,
  ): Promise<void> {
    await this._changeTransitAddressTo(transitId, newAddress.toAddressEntity());
  }

  public async changeTransitAddressFrom(
    transitId: string,
    newAddress: AddressDTO,
  ): Promise<void> {
    await this._changeTransitAddressFrom(
      transitId,
      newAddress.toAddressEntity(),
    );
  }

  public async _changeTransitAddressTo(
    transitId: string,
    newAddress: Address,
  ): Promise<void> {
    await this.addressRepository.save(newAddress);

    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    if (transit.getStatus() === Status.COMPLETED) {
      throw new NotAcceptableException(
        "Address 'to' cannot be changed, id = " + transitId,
      );
    }

    // FIXME later: add some exceptions handling
    const geoFrom: number[] = this.geocodingService.geocodeAddress(
      transit.getFrom(),
    );
    const geoTo: number[] = this.geocodingService.geocodeAddress(newAddress);

    transit.setTo(newAddress);
    transit.setKm(
      this.distanceCalculator.calculateByMap(
        geoFrom[0],
        geoFrom[1],
        geoTo[0],
        geoTo[1],
      ),
    );

    if (transit.getDriver() !== null) {
      this.notificationService.notifyAboutChangedTransitAddress(
        transit.getDriver().getId(),
        transitId,
      );
    }
  }

  public async cancelTransit(transitId: string): Promise<void> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    if (
      ![
        Status.DRAFT,
        Status.WAITING_FOR_DRIVER_ASSIGNMENT,
        Status.TRANSIT_TO_PASSENGER,
      ].includes(transit.getStatus())
    ) {
      throw new NotAcceptableException(
        'Transit cannot be cancelled, id = ' + transitId,
      );
    }

    if (transit.getDriver() !== null) {
      this.notificationService.notifyAboutCancelledTransit(
        transit.getDriver().getId(),
        transitId,
      );
    }

    transit.setStatus(Status.CANCELLED);
    transit.setDriver(null);
    transit.setKm(0);
    transit.setAwaitingDriversResponses(0);

    await this.transitRepository.save(transit);
  }

  public async publishTransit(transitId: string): Promise<Transit> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    transit.setStatus(Status.WAITING_FOR_DRIVER_ASSIGNMENT);
    transit.setPublished(dayjs().toDate());

    await this.transitRepository.save(transit);

    return await this.findDriversForTransit(transitId);
  }

  public async findDriversForTransit(transitId: string): Promise<Transit> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit !== null) {
      if (transit.getStatus() === Status.WAITING_FOR_DRIVER_ASSIGNMENT) {
        let distanceToCheck = 0;

        // Tested on production, works as expected.
        // If you change this code and the system will collapse AGAIN, I'll find you...
        while (true) {
          if (transit.getAwaitingDriversResponses() > 4) {
            return transit;
          }

          distanceToCheck++;

          // FIXME: to refactor when the final business logic will be determined

          // TODO: finish it
        }
      }
    }
  }
}
