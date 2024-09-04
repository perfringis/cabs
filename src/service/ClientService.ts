import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientDTO } from 'src/dto/ClientDTO';
import { Client, PaymentType, Type } from 'src/entity/Client';
import { ClientRepository } from 'src/repository/ClientRepository';

@Injectable()
export class ClientService {
  constructor(private clientRepository: ClientRepository) {}

  public async registerClient(
    name: string,
    lastName: string,
    type: Type,
    paymentType: PaymentType,
  ): Promise<Client> {
    const client: Client = new Client();
    client.setName(name);
    client.setLastName(lastName);
    client.setType(type);
    client.setDefaultPaymentType(paymentType);

    return await this.clientRepository.save(client);
  }

  public async changeDefaultPaymentType(
    clientId: string,
    paymentType: PaymentType,
  ): Promise<void> {
    const client: Client = await this.clientRepository.getOne(clientId);

    if (client === null) {
      throw new NotFoundException('Client does not exists, id =  ' + clientId);
    }

    client.setDefaultPaymentType(paymentType);
    await this.clientRepository.save(client);
  }

  public async upgradeToVIP(clientId: string): Promise<void> {
    const client: Client = await this.clientRepository.getOne(clientId);

    if (client === null) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }

    client.setType(Type.VIP);
    await this.clientRepository.save(client);
  }

  public async downgradeToRegular(clientId: string): Promise<void> {
    const client: Client = await this.clientRepository.getOne(clientId);

    if (client === null) {
      throw new NotFoundException('Client does not exists, id = ' + clientId);
    }

    client.setType(Type.NORMAL);
    await this.clientRepository.save(client);
  }

  public async load(id: string): Promise<ClientDTO> {
    return new ClientDTO(await this.clientRepository.getOne(id));
  }
}
