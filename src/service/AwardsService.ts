import { AwardsAccountDTO } from 'src/dto/AwardsAccountDTO';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AwardsAccountRepository } from 'src/repository/AwardsAccountRepository';
import { ClientRepository } from 'src/repository/ClientRepository';
import { AwardsServiceInterface } from './AwardsServiceInterface';
import { Client } from 'src/entity/Client';
import { AwardsAccount } from 'src/entity/AwardsAccount';

@Injectable()
export class AwardsService implements AwardsServiceInterface {
  constructor(
    private accountRepository: AwardsAccountRepository,
    private clientRepository: ClientRepository,
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
    // PHP implementation look like follows
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

  // TODO finish implementation
}
