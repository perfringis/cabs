import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DriverPositionDTO } from 'src/dto/DriverPositionDTO';
import { DriverPosition } from 'src/entity/DriverPosition';
import { DriverTrackingService } from 'src/service/DriverTrackingService';

@Controller()
export class DriverTrackingController {
  constructor(private driverTrackingService: DriverTrackingService) {}

  @Post('/driverPositions')
  public async create(
    @Body() driverPositionDTO: DriverPositionDTO,
  ): Promise<DriverPositionDTO> {
    const driverPosition: DriverPosition =
      await this.driverTrackingService.registerPosition(
        driverPositionDTO.driverId,
        driverPositionDTO.latitude,
        driverPositionDTO.longitude,
      );

    return this.toDto(driverPosition);
  }

  @Get('/driverPositions/:id/total')
  public async calculateTravelledDistance(
    @Param('id') id: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<number> {
    return await this.driverTrackingService.calculateTravelledDistance(
      id,
      from,
      to,
    );
  }

  private toDto(driverPosition: DriverPosition): DriverPositionDTO {
    const dto: DriverPositionDTO = new DriverPositionDTO(
      driverPosition.getDriver().getId(),
      driverPosition.getLatitude(),
      driverPosition.getLongitude(),
      driverPosition.getSeenAt(),
    );

    return dto;
  }
}
