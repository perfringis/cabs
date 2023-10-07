import { Controller, Get } from '@nestjs/common';
import { CarTypeRepository } from 'src/repository/CarTypeRepository';

@Controller('test')
export class TestController {
  constructor(private carTypeRepository: CarTypeRepository) {}

  @Get('test')
  public async test() {}
}
