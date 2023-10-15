import { Injectable } from '@nestjs/common';
import { Invoice } from 'src/entity/Invoice';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {
  constructor(private dataSource: DataSource) {
    super(Invoice, dataSource.createEntityManager());
  }
}
