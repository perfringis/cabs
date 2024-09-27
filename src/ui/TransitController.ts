import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressDTO } from 'src/dto/AddressDTO';
import { TransitDTO } from 'src/dto/TransitDTO';
import { Transit } from 'src/entity/Transit';
import { TransitService } from 'src/service/TransitService';

@Controller()
export class TransitController {
  constructor(private transitService: TransitService) {}

  @Get('/transits/:id')
  public async getTransit(@Param('id') id: string): Promise<TransitDTO> {
    return await this.transitService.loadTransit(id);
  }

  @Post('/transits')
  public async createTransit(
    @Body() transitDTO: TransitDTO,
  ): Promise<TransitDTO> {
    const transit: Transit = await this.transitService.createTransit(
      transitDTO,
    );

    return await this.transitService.loadTransit(transit.getId());
  }

  @Post('/transits/:id/changeAddressTo')
  public async changeAddressTo(
    @Param('id') id: string,
    @Body() addressDTO: AddressDTO,
  ): Promise<TransitDTO> {
    await this.transitService.changeTransitAddressTo(
      id,
      new AddressDTO(addressDTO),
    );

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/changeAddressFrom')
  public async changeAddressFrom(
    @Param('id') id: string,
    @Body() addressDTO: AddressDTO,
  ): Promise<TransitDTO> {
    await this.transitService.changeTransitAddressFrom(
      id,
      new AddressDTO(addressDTO),
    );

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/cancel')
  public async cancel(@Param('id') id: string): Promise<TransitDTO> {
    await this.transitService.cancelTransit(id);

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/publish')
  public async publishTransit(@Param('id') id: string): Promise<TransitDTO> {
    await this.transitService.publishTransit(id);

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/findDrivers')
  public async findDriversForTransit(
    @Param('id') id: string,
  ): Promise<TransitDTO> {
    await this.transitService.findDriversForTransit(id);

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/accept/:driverId')
  public async acceptTransit(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
  ): Promise<TransitDTO> {
    await this.transitService.acceptTransit(driverId, id);

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/start/:driverId')
  public async start(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
  ): Promise<TransitDTO> {
    await this.transitService.startTransit(driverId, id);

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/reject/:driverId')
  public async reject(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
  ): Promise<TransitDTO> {
    await this.transitService.rejectTransit(driverId, id);

    return await this.transitService.loadTransit(id);
  }

  @Post('/transits/:id/complete/:driverId')
  public async complete(
    @Param('id') id: string,
    @Param('driverId') driverId: string,
    @Body() destination: AddressDTO,
  ): Promise<TransitDTO> {
    await this.transitService.completeTransit(
      driverId,
      id,
      new AddressDTO(destination),
    );

    return await this.transitService.loadTransit(id);
  }
}
