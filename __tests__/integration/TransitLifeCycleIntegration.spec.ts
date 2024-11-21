import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AddressDTO } from 'src/dto/AddressDTO';
import { ClientDTO } from 'src/dto/ClientDTO';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Client } from 'src/entity/Client';
import { Status, Transit } from 'src/entity/Transit';
import { ClientRepository } from 'src/repository/ClientRepository';
import { TransitService } from 'src/service/TransitService';

describe('TariffRecognizingIntegrationTest', () => {
  let transitService: TransitService;
  let clientRepository: ClientRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    transitService = app.get<TransitService>(TransitService);
    clientRepository = app.get<ClientRepository>(ClientRepository);
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
  // test('can change transit destination', () => {});
  // test('cannot change destination when transit is completed', () => {});
  // test('can change pickup place', () => {});
  // test('cannot change pickup place after transit is accepted', () => {});
  // test('cannot change pickup place more than three times', () => {});
  // test('cannot change pickup place when it is far away from original', () => {});
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
});
