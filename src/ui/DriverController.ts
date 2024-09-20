import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DriverDTO } from 'src/dto/DriverDTO';
import { Driver, DriverStatus, DriverType } from 'src/entity/Driver';
import { DriverRepository } from 'src/repository/DriverRepository';
import { DriverService } from 'src/service/DriverService';

@Controller()
export class DriverController {
  constructor(
    private driverService: DriverService,
    private driverRepository: DriverRepository,
  ) {}

  @Post('/drivers')
  public async createDriver(
    @Query('license') license: string,
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Query('photo') photo: string,
  ): Promise<DriverDTO> {
    const driver: Driver = await this.driverService.createDriver(
      license,
      lastName,
      firstName,
      DriverType.CANDIDATE,
      DriverStatus.INACTIVE,
      photo,
    );

    return await this.driverService.loadDriver(driver.getId());
  }

  @Get('/drivers/:id')
  public async getDriver(@Param('id') id: string): Promise<DriverDTO> {
    return await this.driverService.loadDriver(id);
  }

  @Post('/drivers/:id')
  public async updateDriver(@Param('id') id: string): Promise<DriverDTO> {
    return await this.driverService.loadDriver(id);
  }

  @Post('/drivers/:id/deactivate')
  public async deactivateDriver(@Param('id') id: string) {
    await this.driverService.changeDriverStatus(id, DriverStatus.INACTIVE);

    return await this.driverService.loadDriver(id);
  }

  @Post('/drivers/:id/activate')
  public async activateDriver(@Param('id') id: string) {
    await this.driverService.changeDriverStatus(id, DriverStatus.ACTIVE);

    return await this.driverService.loadDriver(id);
  }
}
