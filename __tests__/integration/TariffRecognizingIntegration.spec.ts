import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { Address } from 'src/entity/Address';
import { Client } from 'src/entity/Client';
import { Money } from 'src/entity/Money';
import { Transit } from 'src/entity/Transit';
import { AddressRepository } from 'src/repository/AddressRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TransitDTO } from 'src/dto/TransitDTO';
import { TransitController } from 'src/ui/TransitController';
import { Distance } from 'src/entity/Distance';

dayjs.extend(utc);

describe('TariffRecognizingIntegrationTest', () => {
  let transitRepository: TransitRepository;
  let addressRepository: AddressRepository;
  let clientRepository: ClientRepository;
  let transitController: TransitController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = await module.createNestApplication().init();

    transitRepository = app.get<TransitRepository>(TransitRepository);
    addressRepository = app.get<AddressRepository>(AddressRepository);
    clientRepository = app.get<ClientRepository>(ClientRepository);
    transitController = app.get<TransitController>(TransitController);
  });

  test('new years eve tariff should be displayed', async () => {
    // given
    const transit: Transit = await aCompletedTransitAt(
      60,
      dayjs.utc('2021-12-31 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // when
    const transitDTO: TransitDTO = await transitController.getTransit(
      transit.getId(),
    );

    // then
    expect(transitDTO.getTariff()).toEqual('Sylwester');
    expect(transitDTO.getKmRate()).toEqual(3.5);
  });

  test('weekend tariff should be displayed', async () => {
    // given
    const transit: Transit = await aCompletedTransitAt(
      60,
      dayjs.utc('2021-04-17 08:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // when
    const transitDTO: TransitDTO = await transitController.getTransit(
      transit.getId(),
    );

    // then
    expect(transitDTO.getTariff()).toEqual('Weekend');
    expect(transitDTO.getKmRate()).toEqual(1.5);
  });

  test('weekend plus tariff should be displayed', async () => {
    // given
    const transit: Transit = await aCompletedTransitAt(
      60,
      dayjs.utc('2021-04-17 22:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // when
    const transitDTO: TransitDTO = await transitController.getTransit(
      transit.getId(),
    );

    // then
    expect(transitDTO.getTariff()).toEqual('Weekend+');
    expect(transitDTO.getKmRate()).toEqual(2.5);
  });

  test('standard tariff should be displayed', async () => {
    // given
    const transit: Transit = await aCompletedTransitAt(
      60,
      dayjs.utc('2021-04-13 22:30', 'YYYY-MM-DD HH:mm').toDate(),
    );

    // when
    const transitDTO: TransitDTO = await transitController.getTransit(
      transit.getId(),
    );

    // then
    expect(transitDTO.getTariff()).toEqual('Standard');
    expect(transitDTO.getKmRate()).toEqual(1.0);
  });

  const aCompletedTransitAt = async (
    price: number,
    when: Date,
  ): Promise<Transit> => {
    const client: Client = await aClient();

    const transit: Transit = new Transit(
      await addressRepository.save(
        new Address('Polska', 'Warszawa', 'Młynarska', 20),
      ),
      await addressRepository.save(
        new Address('Polska', 'Warszawa', 'Zytnia', 20),
      ),
      client,
      null,
      when,
      Distance.ofKm(0),
    );

    transit.publishAt(when);
    transit.setPrice(new Money(price));

    return await transitRepository.save(transit);
  };

  const aClient = async (): Promise<Client> => {
    return await clientRepository.save(new Client());
  };
});
