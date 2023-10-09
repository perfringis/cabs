import { Injectable } from '@nestjs/common';
import { DriverAttribute } from 'src/entity/DriverAttribute';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class DriverAttributeRepository extends Repository<DriverAttribute> {
  constructor(private dataSource: DataSource) {
    super(DriverAttribute, dataSource.createEntityManager());
  }
}
