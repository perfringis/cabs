import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
