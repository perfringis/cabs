import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CarTypeDTO } from 'src/dto/CarTypeDTO';
import { CarClass, CarType } from 'src/entity/CarType';
import { CarTypeService } from 'src/service/CarTypeService';
import { Response } from 'express';

@Controller()
export class CarTypeController {
  constructor(private carTypeService: CarTypeService) {}

  @Post('/cartypes')
  public async create(@Body() carTypeDTO: CarTypeDTO): Promise<CarTypeDTO> {
    const created: CarType = await this.carTypeService.create(carTypeDTO);

    return await this.carTypeService.loadDto(created.getId());
  }

  @Post('/cartypes/:carClass/registerCar')
  public async registerCar(
    @Param('carClass') carClass: CarClass,
    @Res() response: Response,
  ): Promise<void> {
    await this.carTypeService.registerCar(carClass);

    response.status(HttpStatus.OK).send();
  }

  @Post('/cartypes/:carClass/unregisterCar')
  public async unregisterCar(
    @Param('carClass') carClass: CarClass,
    @Res() response: Response,
  ): Promise<void> {
    await this.carTypeService.unregisterCar(carClass);

    response.status(HttpStatus.OK).send();
  }

  @Post('/cartypes/:id/activate')
  public async activate(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.carTypeService.activate(id);

    response.status(HttpStatus.OK).send();
  }

  @Post('/cartypes/:id/deactivate')
  public async deactivate(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.carTypeService.deactivate(id);

    response.status(HttpStatus.OK).send();
  }

  @Get('/cartypes/:id')
  public async find(@Param('id') id: string): Promise<CarTypeDTO> {
    const carType: CarTypeDTO = await this.carTypeService.loadDto(id);

    return carType;
  }
}
