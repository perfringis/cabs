import {
  mock,
  instance,
  when,
  verify,
  _,
  deepEqual,
  anyString,
} from '@johanblumenberg/ts-mockito';
import { AppProperties } from 'src/config/AppProperties';
import { AwardsAccountDTO } from 'src/dto/AwardsAccountDTO';
import { AwardsAccount } from 'src/entity/AwardsAccount';
import { Client, ClientType, PaymentType, Type } from 'src/entity/Client';
import { AwardedMilesRepository } from 'src/repository/AwardedMilesRepository';
import { AwardsAccountRepository } from 'src/repository/AwardsAccountRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { TransitRepository } from 'src/repository/TransitRepository';
import { AwardsService } from 'src/service/AwardsService';

describe('AwardsService.findBy', () => {
  let client: Client;
  let awardsAccount: AwardsAccount;

  let accountRepository: AwardsAccountRepository;
  let milesRepository: AwardedMilesRepository;
  let clientRepository: ClientRepository;
  let transitRepository: TransitRepository;
  let appProperties: AppProperties;

  let awardsService: AwardsService;

  beforeEach(() => {
    client = new Client();
    client.setType(Type.NORMAL);
    client.setName('John');
    client.setLastName('Doe');
    client.setDefaultPaymentType(PaymentType.PRE_PAID);
    client.setClientType(ClientType.INDIVIDUAL);

    awardsAccount.setDate(new Date('01-01-2024'));
    awardsAccount.setIsActive(true);
    awardsAccount.increaseTransactions();
    awardsAccount.setClient(client);

    accountRepository = mock(AwardsAccountRepository);
    milesRepository = mock(AwardedMilesRepository);
    milesRepository = mock(AwardedMilesRepository);
    clientRepository = mock(ClientRepository);
    transitRepository = mock(TransitRepository);
    appProperties = mock(AppProperties);

    awardsService = new AwardsService(
      instance(accountRepository),
      instance(milesRepository),
      instance(clientRepository),
      instance(transitRepository),
      instance(appProperties),
    );
  });

  test('should return AwardsAccountDTO', () => {
    // given
    when(clientRepository.getOne(anyString())).thenReturn(
      Promise.resolve(client),
    );
    // and
    when(accountRepository.findByClient(client)).thenReturn(
      Promise.resolve(awardsAccount),
    );
  });

  // then
  expect(awardsService.findBy(anyString())).toEqual(
    new AwardsAccountDTO(awardsAccount),
  );
});
