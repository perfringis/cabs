import { Injectable } from '@nestjs/common';
import { Client } from 'src/entity/Client';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClientRepository extends Repository<Client> {
  constructor(private dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }

  public async getOne(clientId: string): Promise<Client> {
    return await this.findOne({
      where: {
        id: clientId,
      },
    });
  }
}
