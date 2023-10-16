import { Injectable } from '@nestjs/common';
import { AwardsAccount } from 'src/entity/AwardsAccount';
import { Client } from 'src/entity/Client';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AwardsAccountRepository extends Repository<AwardsAccount> {
  constructor(private dataSource: DataSource) {
    super(AwardsAccount, dataSource.createEntityManager());
  }

  public async findByClient(client: Client): Promise<AwardsAccount> {
    // Error: THis approach is not supported now
    // return this.findOne({ where: { client } });

    if (!client) {
      return null;
    }

    return await this.findOne({
      where: {
        client: {
          id: client.getId(),
        },
      },
      relations: {
        client: true,
      },
    });
  }
}
