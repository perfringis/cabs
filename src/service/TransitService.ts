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
import { Driver as T, DriverStatus, Driver } from 'src/entity/Driver';
import { Money } from 'src/entity/Money';
import { Distance } from 'src/entity/Distance';

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

    // FIXME later: add some exceptions handling
    const geoFrom: number[] = this.geocodingService.geocodeAddress(from);
    const geoTo: number[] = this.geocodingService.geocodeAddress(to);

    const km: Distance = Distance.ofKm(
      this.distanceCalculator.calculateByMap(
        geoFrom[0],
        geoFrom[1],
        geoTo[0],
        geoTo[1],
      ),
    );

    const transit: Transit = new Transit(
      from,
      to,
      client,
      carClass,
      dayjs().toDate(),
      km,
    );
    transit.estimateCost();

    return await this.transitRepository.save(transit);
  }

  public async _changeTransitAddressFrom(
    transitId: string,
    newAddress: Address,
  ): Promise<void> {
    const createdNewAddress: Address = await this.addressRepository.save(
      newAddress,
    );
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    // FIXME later: add some exceptions handling
    const geoFromNew: number[] =
      this.geocodingService.geocodeAddress(createdNewAddress);
    const geoFromOld: number[] = this.geocodingService.geocodeAddress(
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

    const newDistance: Distance = Distance.ofKm(
      this.distanceCalculator.calculateByMap(
        geoFromNew[0],
        geoFromNew[1],
        geoFromOld[0],
        geoFromOld[1],
      ),
    );

    transit.changePickUpTo(newAddress, newDistance, distanceInKMeters);
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
    const createdNewAddress: Address = await this.addressRepository.save(
      newAddress,
    );

    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    // FIXME later: add some exceptions handling
    const geoFrom: number[] = this.geocodingService.geocodeAddress(
      transit.getFrom(),
    );
    const geoTo: number[] =
      this.geocodingService.geocodeAddress(createdNewAddress);

    const newDistance: Distance = Distance.ofKm(
      this.distanceCalculator.calculateByMap(
        geoFrom[0],
        geoFrom[1],
        geoTo[0],
        geoTo[1],
      ),
    );

    transit.changeDestinationTo(createdNewAddress, newDistance);

    if (transit.getDriver()) {
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

    transit.cancel();

    if (transit.getDriver()) {
      this.notificationService.notifyAboutCancelledTransit(
        transit.getDriver().getId(),
        transitId,
      );
    }

    await this.transitRepository.save(transit);
  }

  public async publishTransit(transitId: string): Promise<Transit> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit === null) {
      throw new NotFoundException('Transit does not exist, id = ' + transitId);
    }

    transit.publishAt(dayjs().toDate());

    await this.transitRepository.save(transit);

    return await this.findDriversForTransit(transitId);
  }

  // Abandon hope all ye who enter here...
  public async findDriversForTransit(transitId: string): Promise<Transit> {
    const transit: Transit = await this.transitRepository.getOne(transitId);

    if (transit) {
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
            transit.shouldNotWaitForDriverAnyMore(dayjs().toDate()) ||
            distanceToCheck >= 20
          ) {
            transit.failDriverAssignment();
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

          if (!this._isEmpty(driversAvgPositions)) {
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

            if (this._isEmpty(activeCarClasses)) {
              return transit;
            }

            if (transit.getCarType()) {
              if (activeCarClasses.includes(transit.getCarType())) {
                carClasses.push(transit.getCarType());
              } else {
                return transit;
              }
            } else {
              carClasses.push(...activeCarClasses);
            }

            const drivers: T[] = driversAvgPositions.map(
              (d: DriverPositionDTOV2) => d.getDriver(),
            );

            const driverSessions: DriverSession[] =
              await this.driverSessionRepository.findAllByLoggedOutAtNullAndDriverInAndCarClassIn(
                drivers,
                carClasses,
              );

            const activeDriverIdsInSpecificCar: string[] = driverSessions.map(
              (ds) => ds.getDriver().getId(),
            );

            driversAvgPositions = driversAvgPositions.filter((dp) =>
              activeDriverIdsInSpecificCar.includes(dp.getDriver().getId()),
            );

            // Iterate across average driver positions
            for (const driverAvgPosition of driversAvgPositions) {
              const driver: Driver = driverAvgPosition.getDriver();

              if (
                driver.getStatus() === DriverStatus.ACTIVE &&
                driver.getIsOccupied() == false
              ) {
                if (transit.canProposeTo(driver)) {
                  transit.proposeTo(driver);
                  this.notificationService.notifyAboutPossibleTransit(
                    driver.getId(),
                    transitId,
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
        transit.acceptBy(driver, dayjs().toDate());
        await this.transitRepository.save(transit);
        await this.driverRepository.save(driver);
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

    transit.start(dayjs().toDate());

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

    transit.rejectBy(driver);

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

    // FIXME later: add some exceptions handling
    const geoFrom: number[] = this.geocodingService.geocodeAddress(
      transit.getFrom(),
    );
    const geoTo: number[] = this.geocodingService.geocodeAddress(
      transit.getTo(),
    );

    const distance: Distance = Distance.ofKm(
      this.distanceCalculator.calculateByMap(
        geoFrom[0],
        geoFrom[1],
        geoTo[0],
        geoTo[1],
      ),
    );

    const now = dayjs().toDate();
    transit.setCompleteAt(now, destinationAddress, distance);

    const driverFee: Money = await this.driverFeeService.calculateDriverFee(
      transitId,
    );

    transit.setDriversFee(driverFee);
    driver.setIsOccupied(false);

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
  }

  public async loadTransit(id: string): Promise<TransitDTO> {
    return new TransitDTO(await this.transitRepository.getOne(id));
  }

  private _isEmpty<T>(array: T[]): boolean {
    return array.length === 0;
  }
}
