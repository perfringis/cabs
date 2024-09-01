import { AwardsAccountDTO } from 'src/dto/AwardsAccountDTO';
import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { AwardsAccountRepository } from 'src/repository/AwardsAccountRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { AwardsServiceInterface } from './AwardsServiceInterface';
import { Client, ClientType, Type } from 'src/entity/Client';
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

  private isSunday(): boolean {
    return dayjs().day() === 0;
  }

  public async registerSpecialMiles(
    clientId: string,
    miles: number,
  ): Promise<AwardedMiles> {
    const account: AwardsAccount = await this.accountRepository.findByClient(
      await this.clientRepository.getOne(clientId),
    );

    if (!account) {
      throw new NotFoundException('Account does not exists, id = ' + clientId);
    } else {
      const _miles: AwardedMiles = new AwardedMiles();
      _miles.setTransit(null);
      _miles.setClient(account.getClient());
      _miles.setMiles(miles);
      _miles.setDate(new Date());
      _miles.setSpecial(true);

      account.increaseTransactions();

      await this.milesRepository.save(_miles);
      await this.accountRepository.save(account);

      return _miles;
    }
  }

  public async removeMiles(clientId: string, miles: number): Promise<void> {
    const client: Client = await this.clientRepository.getOne(clientId);
    const account: AwardsAccount = await this.accountRepository.findByClient(
      client,
    );

    if (account === null) {
      throw new NotFoundException('Account does not exists, id = ' + clientId);
    } else {
      if (
        (await this.calculateBalance(clientId)) >= miles &&
        account.getIsActive()
      ) {
        const milesList: AwardedMiles[] =
          await this.milesRepository.findAllByClient(client);
        const transitsCounter: number = (
          await this.transitRepository.findByClient(client)
        ).length;

        if (client.getClaims().length >= 3) {
          milesList.sort(
            (a: AwardedMiles, b: AwardedMiles) =>
              b.getExpirationDate()?.getTime() -
                a.getExpirationDate()?.getTime() ||
              (b.getExpirationDate() === null ? 1 : -1),
          );
        } else if (client.getType() === Type.VIP) {
          milesList.sort(
            (a: AwardedMiles, b: AwardedMiles) =>
              Number(a.getIsSpecial()) - Number(b.getIsSpecial()) ||
              a.getExpirationDate()?.getTime() -
                b.getExpirationDate()?.getTime() ||
              (a.getExpirationDate() === null ? -1 : 1),
          );
        } else if (transitsCounter >= 15 && this.isSunday()) {
          milesList.sort(
            (a: AwardedMiles, b: AwardedMiles) =>
              Number(a.getIsSpecial()) - Number(b.getIsSpecial()) ||
              a.getExpirationDate()?.getTime() -
                b.getExpirationDate()?.getTime() ||
              (a.getExpirationDate() === null ? -1 : 1),
          );
        } else if (transitsCounter >= 15) {
          milesList.sort(
            (a: AwardedMiles, b: AwardedMiles) =>
              Number(a.getIsSpecial()) - Number(b.getIsSpecial()) ||
              a.getDate().getTime() - b.getDate().getTime(),
          );
        } else {
          milesList.sort(
            (a: AwardedMiles, b: AwardedMiles) =>
              a.getDate().getTime() - b.getDate().getTime(),
          );
        }

        for (const iter of milesList) {
          if (miles <= 0) {
            break;
          }

          if (
            iter.getIsSpecial() ||
            dayjs(iter.getExpirationDate()).isAfter(dayjs())
          ) {
            if (iter.getMiles() <= miles) {
              miles -= iter.getMiles();
              iter.setMiles(0);
            } else {
              iter.setMiles(iter.getMiles() - miles);
              miles = 0;
            }
            await this.milesRepository.save(iter);
          }
        }
      } else {
        throw new NotAcceptableException(
          'Insufficient miles, id = ' +
            clientId +
            ', miles requested = ' +
            miles,
        );
      }
    }
  }

  public async calculateBalance(clientId: string): Promise<number> {
    const client: Client = await this.clientRepository.getOne(clientId);
    const milesList: AwardedMiles[] =
      await this.milesRepository.findAllByClient(client);

    return milesList
      .filter(
        (t) =>
          (t.getExpirationDate() !== null &&
            dayjs(t.getExpirationDate()).isAfter(new Date())) ||
          t.getIsSpecial(),
      )
      .map((t) => t.getMiles())
      .reduce((prev, curr) => prev + curr, 0);
  }
}
