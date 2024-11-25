import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AddressDTO } from 'src/dto/AddressDTO';
import { CarTypeDTO } from 'src/dto/CarTypeDTO';
import { ClientDTO } from 'src/dto/ClientDTO';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Address } from 'src/entity/Address';
import { CarClass, CarType } from 'src/entity/CarType';
import { Client } from 'src/entity/Client';
import { Driver, DriverStatus, DriverType } from 'src/entity/Driver';
import { DriverFee, FeeType } from 'src/entity/DriverFee';
import { Status, Transit } from 'src/entity/Transit';
import { ClientRepository } from 'src/repository/ClientRepository';
import { DriverFeeRepository } from 'src/repository/DriverFeeRepository';
import { CarTypeService } from 'src/service/CarTypeService';
import { DriverService } from 'src/service/DriverService';
import { DriverSessionService } from 'src/service/DriverSessionService';
import { DriverTrackingService } from 'src/service/DriverTrackingService';
import { GeocodingService } from 'src/service/GeocodingService';
import { TransitService } from 'src/service/TransitService';

describe('TariffRecognizingIntegrationTest', () => {
  let transitService: TransitService;
  let clientRepository: ClientRepository;
  let driverService: DriverService;
  let feeRepository: DriverFeeRepository;
  let driverSessionService: DriverSessionService;
  let driverTrackingService: DriverTrackingService;
  let carTypeService: CarTypeService;
  let geocodingService: GeocodingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    transitService = app.get<TransitService>(TransitService);
    clientRepository = app.get<ClientRepository>(ClientRepository);
    driverService = app.get<DriverService>(DriverService);
    feeRepository = app.get<DriverFeeRepository>(DriverFeeRepository);
    driverSessionService = app.get<DriverSessionService>(DriverSessionService);
    driverTrackingService = app.get<DriverTrackingService>(
      DriverTrackingService,
    );
    carTypeService = app.get<CarTypeService>(CarTypeService);
    geocodingService = app.get<GeocodingService>(GeocodingService);

    await anActiveCarCategory(CarClass.VAN);
  });

  test('can create transit', async () => {
    // when
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 25,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    // then
    const loaded: TransitDTO = await transitService.loadTransit(
      transit.getId(),
    );

    expect(loaded.getCarClass()).toBeNull();
    expect(loaded.getClaimDTO()).toBeUndefined();
    expect(loaded.getEstimatedPrice()).not.toBeNull();
    expect(loaded.getPrice()).toBeNull();

    expect(loaded.getFrom().getCountry()).toEqual('Polska');
    expect(loaded.getFrom().getCity()).toEqual('Warszawa');
    expect(loaded.getFrom().getStreet()).toEqual('Młynarska');
    expect(loaded.getFrom().getBuildingNumber()).toEqual(20);

    expect(loaded.getTo().getCountry()).toEqual('Polska');
    expect(loaded.getTo().getCity()).toEqual('Warszawa');
    expect(loaded.getTo().getStreet()).toEqual('Żytnia');
    expect(loaded.getTo().getBuildingNumber()).toEqual(25);

    expect(loaded.getStatus()).toEqual(Status.DRAFT);
    expect(loaded.getTariff()).not.toBeNull();
    expect(loaded.getKmRate()).not.toEqual(0);
    expect(loaded.getDateTime()).not.toBeNull();
  });

  test('can change transit destination', async () => {
    // given
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 25,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    // when
    await transitService.changeTransitAddressTo(
      transit.getId(),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Mazowiecka',
        buildingNumber: 30,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    // then
    const loaded: TransitDTO = await transitService.loadTransit(
      transit.getId(),
    );

    expect(loaded.getTo().getBuildingNumber()).toEqual(30);
    expect(loaded.getTo().getStreet()).toEqual('Mazowiecka');
    expect(loaded.getEstimatedPrice()).not.toBeNull();
    expect(loaded.getPrice()).toBeNull();
  });

  test('cannot change destination when transit is completed', async () => {
    // given
    const destination: AddressDTO = new AddressDTO({
      country: 'Polska',
      district: null,
      city: 'Warszawa',
      street: 'Żytnia',
      buildingNumber: 25,
      additionalNumber: null,
      postalCode: null,
      name: null,
    });
    // and
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      destination,
    );
    // and
    const driverId: string = await aNearbyDriver('WU1212');
    // and
    await transitService.publishTransit(transit.getId());
    // and
    await transitService.acceptTransit(driverId, transit.getId());
    // and
    await transitService.startTransit(driverId, transit.getId());
    // and
    await transitService.completeTransit(
      driverId,
      transit.getId(),
      destination,
    );

    // expect
    await expect(
      transitService.changeTransitAddressTo(
        transit.getId(),
        new AddressDTO({
          country: 'Polska',
          district: null,
          city: 'Warszawa',
          street: 'Żytnia',
          buildingNumber: 23,
          additionalNumber: null,
          postalCode: null,
          name: null,
        }),
      ),
    ).rejects.toThrow(NotAcceptableException);
  });

  test('can change pickup place', async () => {
    // given
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 25,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    // when
    await transitService.changeTransitAddressFrom(
      transit.getId(),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Puławska',
        buildingNumber: 28,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    // then
    const loaded: TransitDTO = await transitService.loadTransit(
      transit.getId(),
    );

    expect(loaded.getFrom().getBuildingNumber()).toEqual(28);
    expect(loaded.getFrom().getStreet()).toEqual('Puławska');
  });

  test('cannot change pickup place after transit is accepted', async () => {
    // given
    const destination: AddressDTO = new AddressDTO({
      country: 'Polska',
      district: null,
      city: 'Warszawa',
      street: 'Żytnia',
      buildingNumber: 25,
      additionalNumber: null,
      postalCode: null,
      name: null,
    });
    // and
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      destination,
    );
    // and
    const changeTo: AddressDTO = new AddressDTO({
      country: 'Polska',
      district: null,
      city: 'Warszawa',
      street: 'Żytnia',
      buildingNumber: 27,
      additionalNumber: null,
      postalCode: null,
      name: null,
    });
    // and
    const driverId: string = await aNearbyDriver('WU1212');
    // and
    await transitService.publishTransit(transit.getId());
    // and
    await transitService.acceptTransit(driverId, transit.getId());

    // expect
    await expect(
      transitService.changeTransitAddressFrom(transit.getId(), changeTo),
    ).rejects.toThrow(NotAcceptableException);
  });

  test('cannot change pickup place more than three times', async () => {
    // given
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 25,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );
    // and
    await transitService.changeTransitAddressFrom(
      transit.getId(),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 26,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );
    // and
    await transitService.changeTransitAddressFrom(
      transit.getId(),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 27,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );
    // and
    await transitService.changeTransitAddressFrom(
      transit.getId(),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 28,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    await expect(
      transitService.changeTransitAddressFrom(
        transit.getId(),
        new AddressDTO({
          country: 'Polska',
          district: null,
          city: 'Warszawa',
          street: 'Żytnia',
          buildingNumber: 29,
          additionalNumber: null,
          postalCode: null,
          name: null,
        }),
      ),
    ).rejects.toThrow(NotAcceptableException);
  });

  test('cannot change pickup place when it is far away from original', async () => {
    // given
    const transit: Transit = await requestTransitFromTo(
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Młynarska',
        buildingNumber: 20,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
      new AddressDTO({
        country: 'Polska',
        district: null,
        city: 'Warszawa',
        street: 'Żytnia',
        buildingNumber: 25,
        additionalNumber: null,
        postalCode: null,
        name: null,
      }),
    );

    // expect
    await expect(
      transitService.changeTransitAddressFrom(
        transit.getId(),
        farAwayAddress(transit),
      ),
    ).rejects.toThrow(NotAcceptableException);
  });

  // test('can cancel transit', () => {});
  // test('cannot cancel transit after it was started', () => {});
  // test('can publish transit', () => {});
  // test('can accept transit', () => {});
  // test('only one driver can accept transit', () => {});
  // test('transit cannot be accepted by driver who already rejected', () => {});
  // test('transit cannot be accepted by driver who has not seen proposal', () => {});
  // test('can start transit', () => {});
  // test('cannot start not accepted transit', () => {});
  // test('can complete transit', () => {});
  // test('cannot complete not started transit', () => {});
  // test('can reject transit', () => {});

  const _driverHasFee = async (
    driver: Driver,
    feeType: FeeType,
    amount: number,
    min: number,
  ): Promise<DriverFee> => {
    const driverFee: DriverFee = new DriverFee(feeType, driver, amount, min);

    return await feeRepository.save(driverFee);
  };

  const driverHasFee = async (
    driver: Driver,
    feeType: FeeType,
    amount: number,
  ): Promise<DriverFee> => {
    return await _driverHasFee(driver, feeType, amount, 0);
  };

  const aDriver = async (): Promise<Driver> => {
    return await driverService.createDriver(
      'FARME100165AB5EW',
      'Kowalski',
      'Janusz',
      DriverType.REGULAR,
      DriverStatus.ACTIVE,
      '',
    );
  };

  const aNearbyDriver = async (plateNumber: string): Promise<string> => {
    const driver: Driver = await aDriver();
    await driverHasFee(driver, FeeType.FLAT, 10);
    await driverSessionService.logIn(
      driver.getId(),
      plateNumber,
      CarClass.VAN,
      'BRAND',
    );
    await driverTrackingService.registerPosition(driver.getId(), 1, 1);

    return driver.getId();
  };

  const aClient = async () => {
    return await clientRepository.save(new Client());
  };

  const _aTransitDTO = async (
    client: Client,
    from: AddressDTO,
    to: AddressDTO,
  ): Promise<TransitDTO> => {
    const transitDTO: TransitDTO = new TransitDTO();
    transitDTO.setClientDTO(new ClientDTO(client));
    transitDTO.setFrom(from);
    transitDTO.setTo(to);

    return transitDTO;
  };

  const aTransitDTO = async (from: AddressDTO, to: AddressDTO) => {
    const client: Client = await aClient();

    return await _aTransitDTO(client, from, to);
  };

  const requestTransitFromTo = async (
    pickup: AddressDTO,
    destination: AddressDTO,
  ): Promise<Transit> => {
    return await transitService.createTransit(
      await aTransitDTO(pickup, destination),
    );
  };

  const anActiveCarCategory = async (carClass: CarClass): Promise<CarType> => {
    const carTypeDTO: CarTypeDTO = new CarTypeDTO();
    carTypeDTO.setCarClass(carClass);
    carTypeDTO.setDescription('opis');

    const carType: CarType = await carTypeService.create(carTypeDTO);

    for (let i = 1; i < carType.getMinNoOfCarsToActivateClass() + 1; i++) {
      await carTypeService.registerCar(carType.getCarClass());
    }

    await carTypeService.activate(carType.getId());

    return carType;
  };

  const farAwayAddress = (transit: Transit) => {
    const addressDTO: AddressDTO = new AddressDTO({
      country: 'Dania',
      district: null,
      city: 'Kopenhaga',
      street: 'Mylve',
      buildingNumber: 2,
      additionalNumber: null,
      postalCode: null,
      name: null,
    });

    jest
      .spyOn(geocodingService, 'geocodeAddress')
      .mockImplementation((address: Address) => {
        if (transit.getFrom().getId() === address.getId()) {
          return [1, 1];
        } else {
          return [1000, 1000];
        }
      });

    return addressDTO;
  };
});
