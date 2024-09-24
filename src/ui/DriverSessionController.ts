import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  Post,
  Get,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DriverSessionDTO } from 'src/dto/DriverSessionDTO';
import { DriverSessionService } from 'src/service/DriverSessionService';

@Controller()
export class DriverSessionController {
  constructor(private driverSessionService: DriverSessionService) {}

  @Post('/drivers/:driverId/driverSessions/login')
  public async logIn(
    @Param('driverId') driverId: string,
    @Body() dto: DriverSessionDTO,
    @Res() response: Response,
  ): Promise<void> {
    await this.driverSessionService.logIn(
      driverId,
      dto.platesNumber,
      dto.carClass,
      dto.carBrand,
    );

    response.status(HttpStatus.OK).send();
  }

  @Delete('/drivers/:driverId/driverSessions/:sessionId')
  public async logOut(
    @Param('driverId') driverId: string,
    @Param('sessionId') sessionId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.driverSessionService.logOut(sessionId);

    response.status(HttpStatus.OK).send();
  }

  @Delete('/drivers/:driverId/driverSessions')
  public async logOutCurrent(
    @Param('driverId') driverId: string,
    @Res() response: Response,
  ) {
    await this.driverSessionService.logOutCurrentSession(driverId);

    response.status(HttpStatus.OK).send();
  }

  @Get('/drivers/:driverId/driverSessions')
  public async list(
    @Param('driverId') driverId: string,
  ): Promise<DriverSessionDTO[]> {
    return (await this.driverSessionService.findByDriver(driverId)).map(
      (ds) => {
        return new DriverSessionDTO(ds);
      },
    );
  }
}
