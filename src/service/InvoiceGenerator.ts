import { Injectable } from '@nestjs/common';
import { Invoice } from 'src/entity/Invoice';
import { InvoiceRepository } from 'src/repository/InvoiceRepository';

@Injectable()
export class InvoiceGenerator {
  constructor(private invoiceRepository: InvoiceRepository) {}

  public async generate(amount: number, subjectName: string): Promise<Invoice> {
    return await this.invoiceRepository.save(new Invoice(amount, subjectName));
  }
}
