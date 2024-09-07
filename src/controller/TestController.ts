import { Controller, Get } from '@nestjs/common';
import { Invoice } from 'src/entity/Invoice';
import { InvoiceGenerator } from 'src/service/InvoiceGenerator';

@Controller('test')
export class TestController {
  constructor(private invoiceGenerator: InvoiceGenerator) {}

  @Get('test')
  public async test(): Promise<Invoice> {
    return await this.invoiceGenerator.generate(1, 'xd');
  }
}
