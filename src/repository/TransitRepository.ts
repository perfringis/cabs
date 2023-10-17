import { Injectable } from '@nestjs/common';
import { Address } from 'src/entity/Address';
import { Client } from 'src/entity/Client';
import { Driver } from 'src/entity/Driver';
import { Status, Transit } from 'src/entity/Transit';
import { Between, DataSource, MoreThan, Repository } from 'typeorm';

@Injectable()
export class TransitRepository extends Repository<Transit> {
  constructor(private dataSource: DataSource) {
    super(Transit, dataSource.createEntityManager());
  }

  public async findAllByDriverAndDateTimeBetween(
    driver: Driver,
    from: Date,
    to: Date,
  ): Promise<Transit[]> {
    return await this.find({
      where: {
        driver: {
          id: driver.getId(),
        },
        dateTime: Between(from, to),
      },
    });
  }

  public async findAllByClientAndFromAndStatusOrderByDateTimeDesc(
    client: Client,
    from: Address,
    status: Status,
  ): Promise<Transit[]> {
    return await this.find({
      where: {
        client: {
          id: client.getId(),
        },
        from: {
          id: from.getId(),
        },
        status: status,
      },
    });
  }

  public async findAllByClientAndFromAndPublishedAfterAndStatusOrderByDateTimeDesc(
    client: Client,
    from: Address,
    when: Date,
    status: Status,
  ): Promise<Transit[]> {
    return await this.find({
      where: {
        client: {
          id: client.getId(),
        },
        from: {
          id: from.getId(),
        },
        published: MoreThan(when),
        status: status,
      },
      order: {
        dateTime: 'DESC',
      },
    });
  }

  public async findByClient(client: Client): Promise<Transit[]> {
    return await this.find({
      where: {
        client: {
          id: client.getId(),
        },
      },
    });
  }

  public async getOne(transitId: string): Promise<Transit> {
    return await this.findOne({
      where: {
        id: transitId,
      },
    });
  }
}
