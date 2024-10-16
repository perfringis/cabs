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
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import { DriverPositionDTOV2 } from 'src/dto/DriverPositionDTOV2';
import { DriverSession } from 'src/entity/DriverSession';
import { Driver, DriverStatus } from 'src/entity/Driver';

@Injectable()
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
    const from: Address = await this.addressFromDto(
      new AddressDTO(transitDTO.from),
    );
    const to: Address = await this.addressFromDto(
      new AddressDTO(transitDTO.to),
    );

    return await this._createTransit(
      transitDTO.clientDTO.id,
      from,
      to,
      transitDTO.carClass,
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
    newAddress = await this.addressRepository.save(newAddress);

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

    await this.transitRepository.save(transit);
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

  // Abandon hope all ye who enter here...
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
          if (
            dayjs(transit.getPublished())
              .add(300, 'second')
              .isBefore(dayjs()) ||
            distanceToCheck >= 20 ||
            // Should it be here? How is it even possible due to previous status check above loop?
            transit.getStatus() === Status.CANCELLED
          ) {
            transit.setStatus(Status.DRIVER_ASSIGNMENT_FAILED);
            transit.setDriver(null);
            transit.setKm(0);
            transit.setAwaitingDriversResponses(0);

            await this.transitRepository.save(transit);

            return transit;
          }

          let geocoded: number[] = [0, 0];

          try {
            geocoded = this.geocodingService.geocodeAddress(transit.getFrom());
          } catch (e) {
            // Geocoding failed! Ask Jessica or Bryan for some help if needed.
          }

          const longitude: number = geocoded[1];
          const latitude: number = geocoded[0];

          //https://gis.stackexchange.com/questions/2951/algorithm-for-offsetting-a-latitude-longitude-by-some-amount-of-meters
          //Earth’s radius, sphere
          //double R = 6378;
          const R = 6371; // Changed to 6371 due to Copy&Paste pattern from different source

          //offsets in meters
          const dn: number = distanceToCheck;
          const de: number = distanceToCheck;

          //Coordinate offsets in radians
          const dLat: number = dn / R;
          const dLon: number = de / (R * Math.cos((Math.PI * latitude) / 180));

          //Offset positions, decimal degrees
          const latitudeMin: number = latitude - (dLat * 180) / Math.PI;
          const latitudeMax: number = latitude + (dLat * 180) / Math.PI;
          const longitudeMin: number = longitude - (dLon * 180) / Math.PI;
          const longitudeMax: number = longitude + (dLon * 180) / Math.PI;

          let driversAvgPositions: DriverPositionDTOV2[] =
            await this.driverPositionRepository.findAverageDriverPositionSince(
              latitudeMin,
              latitudeMax,
              longitudeMin,
              longitudeMax,
              dayjs().subtract(5, 'minute').toDate(),
            );

          if (!(driversAvgPositions.length === 0)) {
            const comparator = (
              d1: DriverPositionDTOV2,
              d2: DriverPositionDTOV2,
            ) => {
              const dist1: number = Math.sqrt(
                Math.pow(latitude - d1.getLatitude(), 2) +
                  Math.pow(longitude - d1.getLongitude(), 2),
              );

              const dist2: number = Math.sqrt(
                Math.pow(latitude - d2.getLatitude(), 2) +
                  Math.pow(longitude - d2.getLongitude(), 2),
              );

              return dist1 - dist2;
            };

            driversAvgPositions.sort(comparator);
            driversAvgPositions = driversAvgPositions.splice(0, 20);

            const carClasses: CarClass[] = [];
            const activeCarClasses: CarClass[] =
              await this.carTypeService.findActiveCarClasses();

            if (activeCarClasses.length === 0) {
              return transit;
            }

            if (transit.getCarType() !== null) {
              if (activeCarClasses.includes(transit.getCarType())) {
                carClasses.push(transit.getCarType());
              } else {
                return transit;
              }
            } else {
              carClasses.push(...activeCarClasses);
            }

            const drivers: Driver[] = await Promise.all(
              driversAvgPositions.map(async (d) => {
                return d.getDriver();
              }),
            );

            const driverSessions: DriverSession[] =
              await this.driverSessionRepository.findAllByLoggedOutAtNullAndDriverInAndCarClassIn(
                drivers,
                carClasses,
              );

            const activeDriverIdsInSpecificCar: string[] = await Promise.all(
              driverSessions.map(async (ds) => {
                return ds.getDriver().getId();
              }),
            );

            driversAvgPositions = await Promise.all(
              driversAvgPositions.filter((dp) => {
                return activeDriverIdsInSpecificCar.includes(
                  dp.getDriver().getId(),
                );
              }),
            );

            // Iterate across average driver positions
            for (const driverAvgPosition of driversAvgPositions) {
              const driver: Driver = driverAvgPosition.getDriver();

              if (
                driver.getStatus() === DriverStatus.ACTIVE &&
                driver.getIsOccupied() === false
              ) {
                if (!transit.getDriversRejections().includes(driver)) {
                  transit.getProposedDrivers().push(driver);
                  transit.setAwaitingDriversResponses(
                    transit.getAwaitingDriversResponses() + 1,
                  );
                }
              } else {
                // Not implemented yet!
              }
            }

            await this.transitRepository.save(transit);
          } else {
            // Next iteration, no drivers at specified area
            continue;
          }
        }
      } else {
        throw new NotAcceptableException('..., id = ' + transitId);
      }
    } else {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }
  }

  public async acceptTransit(
    driverId: string,
    transitId: string,
  ): Promise<void> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exist, id = ' + driverId);
    } else {
      const transit: Transit = await this.transitRepository.getOne(transitId);

      if (transit === null) {
        throw new NotFoundException(
          'Transit does not exist, id = ' + transitId,
        );
      } else {
        if (transit.getDriver() !== null) {
          throw new NotAcceptableException(
            'Transit already accepted, id = ' + transitId,
          );
        } else {
          if (!this._includes(transit.getProposedDrivers(), driver)) {
            throw new NotAcceptableException(
              'Driver out of possible drivers, id = ' + transitId,
            );
          } else {
            if (this._includes(transit.getProposedDrivers(), driver)) {
              throw new NotAcceptableException(
                'Driver out of possible drivers, id = ' + transitId,
              );
            } else {
              transit.setDriver(driver);
              transit.setAwaitingDriversResponses(0);
              transit.setAcceptedAt(dayjs().toDate());
              transit.setStatus(Status.TRANSIT_TO_PASSENGER);
              await this.transitRepository.save(transit);

              driver.setIsOccupied(true);
              await this.driverRepository.save(driver);
            }
          }
        }
      }
    }
  }

  public async startTransit(
    driverId: string,
    transitId: string,
  ): Promise<void> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exist, id = ' + driverId);
    }

    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    if (!(transit.getStatus() === Status.TRANSIT_TO_PASSENGER)) {
      throw new NotAcceptableException(
        'Transit cannot be started, id = ' + transitId,
      );
    }

    transit.setStatus(Status.IN_TRANSIT);
    transit.setStarted(dayjs().toDate());

    await this.transitRepository.save(transit);
  }

  public async rejectTransit(
    driverId: string,
    transitId: string,
  ): Promise<void> {
    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exist, id = ' + driverId);
    }

    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    transit.getDriversRejections().push(driver);
    transit.setAwaitingDriversResponses(
      transit.getAwaitingDriversResponses() - 1,
    );

    await this.transitRepository.save(transit);
  }

  public async completeTransit(
    driverId: string,
    transitId: string,
    destinationAddress: AddressDTO,
  ): Promise<void> {
    await this._completeTransit(
      driverId,
      transitId,
      destinationAddress.toAddressEntity(),
    );
  }

  public async _completeTransit(
    driverId: string,
    transitId: string,
    destinationAddress: Address,
  ) {
    destinationAddress = await this.addressRepository.save(destinationAddress);

    const driver: Driver = await this.driverRepository.getOne(driverId);

    if (driver === null) {
      throw new NotFoundException('Driver does not exist, id = ' + driverId);
    }

    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    if (transit.getStatus() === Status.IN_TRANSIT) {
      // FIXME later: add some exceptions handling
      const geoFrom: number[] = this.geocodingService.geocodeAddress(
        transit.getFrom(),
      );
      const geoTo: number[] = this.geocodingService.geocodeAddress(
        transit.getTo(),
      );

      transit.setTo(destinationAddress);
      transit.setKm(
        this.distanceCalculator.calculateByMap(
          geoFrom[0],
          geoFrom[1],
          geoTo[0],
          geoTo[1],
        ),
      );
      transit.setStatus(Status.COMPLETED);
      transit.calculateFinalCosts();
      driver.setIsOccupied(false);
      transit.setCompleteAt(dayjs().toDate());
      const driverFee: number = await this.driverFeeService.calculateDriverFee(
        transitId,
      );
      transit.setDriversFee(driverFee);

      await this.driverRepository.save(driver);

      await this.awardsService.registerMiles(
        transit.getClient().getId(),
        transitId,
      );

      await this.transitRepository.save(transit);

      await this.invoiceGenerator.generate(
        transit.getPrice().toInt(),
        transit.getClient().getName() + ' ' + transit.getClient().getLastName(),
      );
    } else {
      throw new NotAcceptableException(
        'Cannot complete Transit, id = ' + transitId,
      );
    }
  }

  public async loadTransit(id: string): Promise<TransitDTO> {
    return new TransitDTO(await this.transitRepository.getOne(id));
  }

  private _includes(proposedDrivers: Driver[], driver: Driver): boolean {
    return (
      proposedDrivers.filter((d) => d.getId() === driver.getId()).length > 0
    );
  }
}
