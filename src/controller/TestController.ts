import { Controller, Get } from '@nestjs/common';
import { ClientDTO } from 'src/dto/ClientDTO';
import { ClientService } from 'src/service/ClientService';

@Controller('test')
export class TestController {
  constructor(private clientService: ClientService) {}

  @Get('test')
  public async test(): Promise<ClientDTO> {
    return await this.clientService.load(
      '10d1ee1a-6828-49e3-ac90-a30f158a4fbc',
    );
  }
}
