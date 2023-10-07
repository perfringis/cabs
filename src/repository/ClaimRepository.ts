import { Injectable } from '@nestjs/common';
import { Claim } from 'src/entity/Claim';
import { Client } from 'src/entity/Client';
import { Transit } from 'src/entity/Transit';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClaimRepository extends Repository<Claim> {
  constructor(private dataSource: DataSource) {
    super(Claim, dataSource.createEntityManager());
  }

  public async findByOwner(owner: Client): Promise<Claim[]> {
    // TODO maybe in future wil be changed
    // return this.find({ where: { owner } });
    // return this.find({ where: { owner, transit } });

    return await this.find({
      where: {
        owner: {
          id: owner.getId(),
        },
      },
      relations: {
        owner: false,
      },
    });
  }

  public async findByOwnerAndTransit(
    owner: Client,
    transit: Transit,
  ): Promise<Claim[]> {
    return await this.find({
      where: {
        owner: {
          id: owner.getId(),
        },
        transit: { id: transit.getId() },
      },
    });
  }
}
