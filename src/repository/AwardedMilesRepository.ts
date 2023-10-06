import { Injectable } from '@nestjs/common';
import { AwardedMiles } from 'src/entity/AwardedMiles';
import { Client } from 'src/entity/Client';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AwardedMilesRepository extends Repository<AwardedMiles> {
  constructor(private dataSource: DataSource) {
    super(AwardedMiles, dataSource.createEntityManager());
  }

  public async findAllByClient(client: Client): Promise<AwardedMiles[]> {
    // TODO
    return await this.find({
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
