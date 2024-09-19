import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientDTO } from 'src/dto/ClientDTO';
import { Client } from 'src/entity/Client';
import { ClientService } from 'src/service/ClientService';

@Controller()
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Post('/clients')
  public async register(@Body() dto: ClientDTO): Promise<ClientDTO> {
    const c: Client = await this.clientService.registerClient(
      dto.name,
      dto.lastName,
      dto.type,
      dto.defaultPaymentType,
    );

    return await this.clientService.load(c.getId());
  }

  @Get('/clients/:clientId')
  public async find(@Param('clientId') clientId: string): Promise<ClientDTO> {
    return this.clientService.load(clientId);
  }

  @Post('/clients/:clientId/upgrade')
  public async upgradeToVIP(
    @Param('clientId') clientId: string,
  ): Promise<ClientDTO> {
    await this.clientService.upgradeToVIP(clientId);

    return await this.clientService.load(clientId);
  }

  @Post('/clients/:clientId/downgrade')
  public async downgrade(
    @Param('clientId') clientId: string,
  ): Promise<ClientDTO> {
    await this.clientService.downgradeToRegular(clientId);

    return await this.clientService.load(clientId);
  }

  @Post('/clients/:clientId/changeDefaultPaymentType')
  public async changeDefaultPaymentType(
    @Param('clientId') clientId: string,
    @Body() dto: ClientDTO,
  ): Promise<ClientDTO> {
    await this.clientService.changeDefaultPaymentType(
      clientId,
      dto.defaultPaymentType,
    );

    return await this.clientService.load(clientId);
  }
}
