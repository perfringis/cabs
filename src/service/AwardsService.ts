import { AwardsAccountDTO } from 'src/dto/AwardsAccountDTO';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AwardsAccountRepository } from 'src/repository/AwardsAccountRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { AwardsServiceInterface } from './AwardsServiceInterface';
import { Client } from 'src/entity/Client';
import { AwardsAccount } from 'src/entity/AwardsAccount';
import { AwardedMiles } from 'src/entity/AwardedMiles';
import { Transit } from 'src/entity/Transit';
import { TransitRepository } from 'src/repository/TransitRepository';
import { AwardedMilesRepository } from 'src/repository/AwardedMilesRepository';
import dayjs from 'dayjs';
import { AppProperties } from 'src/config/AppProperties';

@Injectable()
export class AwardsService implements AwardsServiceInterface {
  constructor(
    private accountRepository: AwardsAccountRepository,
    private milesRepository: AwardedMilesRepository,
    private clientRepository: ClientRepository,
    private transitRepository: TransitRepository,
    private appProperties: AppProperties,
  ) {}

  public async findBy(clientId: string): Promise<AwardsAccountDTO> {
    return new AwardsAccountDTO(
      await this.accountRepository.findByClient(
        await this.clientRepository.getOne(clientId),
      ),
    );
  }

  public async registerToProgram(clientId: string): Promise<void> {
    const client: Client = await this.clientRepository.getOne(clientId);

    if (!client) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }

    const account: AwardsAccount = new AwardsAccount();

    account.setClient(client);
    account.setIsActive(false);
    account.setDate(new Date());

    await this.accountRepository.save(account);
  }

  public async activateAccount(clientId: string): Promise<void> {
    // PHP implementation look like follow
    // this.accountRepository.findByClientId
    const account: AwardsAccount = await this.accountRepository.findByClient(
      await this.clientRepository.getOne(clientId),
    );

    if (!account) {
      throw new NotFoundException('Account does not exists, id = ' + clientId);
    }

    account.setIsActive(true);

    await this.accountRepository.save(account);
  }

  public async deactivateAccount(clientId: string): Promise<void> {
    // PHP implementation look like follow
    // this.accountRepository.findByClientId
    const account: AwardsAccount = await this.accountRepository.findByClient(
      await this.clientRepository.getOne(clientId),
    );

    if (!account) {
      throw new NotFoundException('Account does not exists, id = ' + clientId);
    }

    account.setIsActive(false);

    await this.accountRepository.save(account);
  }

  public async registerMiles(
    clientId: string,
    transitId: string,
  ): Promise<AwardedMiles> {
    const account: AwardsAccount = await this.accountRepository.findByClient(
      await this.clientRepository.getOne(clientId),
    );

    const transit: Transit = await this.transitRepository.getOne(transitId);
    if (!transit) {
      throw new NotFoundException('transit does not exists, id = ' + transitId);
    }

    const now: Date = new Date();

    if (!account || !account.getIsActive()) {
      return null;
    } else {
      const miles: AwardedMiles = new AwardedMiles();

      miles.setTransit(transit);
      miles.setDate(new Date());
      miles.setClient(account.getClient());
      miles.setMiles(this.appProperties.getDefaultMilesBonus());
      miles.setExpirationDate(
        dayjs(now)
          .add(this.appProperties.getMilesExpirationInDays(), 'day')
          .toDate(),
      );
      miles.setSpecial(false);

      account.increaseTransactions();

      await this.milesRepository.save(miles);
      await this.accountRepository.save(account);

      return miles;
    }
  }
}
