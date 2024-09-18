import { Controller, Get, Param, Post } from '@nestjs/common';
import { AwardsAccountDTO } from 'src/dto/AwardsAccountDTO';
import { AwardsService } from 'src/service/AwardsService';

@Controller()
export class AwardsAccountController {
  constructor(private awardsService: AwardsService) {}

  @Post('/clients/:clientId/awards')
  public async register(
    @Param('clientId') clientId: string,
  ): Promise<AwardsAccountDTO> {
    await this.awardsService.registerToProgram(clientId);

    return await this.awardsService.findBy(clientId);
  }

  @Post('/clients/:clientId/awards/activate')
  public async activate(
    @Param('clientId') clientId: string,
  ): Promise<AwardsAccountDTO> {
    await this.awardsService.activateAccount(clientId);

    return await this.awardsService.findBy(clientId);
  }

  @Post('/clients/:clientId/awards/deactivate')
  public async deactivate(
    @Param('clientId') clientId: string,
  ): Promise<AwardsAccountDTO> {
    await this.awardsService.deactivateAccount(clientId);

    return await this.awardsService.findBy(clientId);
  }

  @Get('/clients/:clientId/awards/balance')
  public async calculateBalance(
    @Param('clientId') clientId: string,
  ): Promise<number> {
    return await this.awardsService.calculateBalance(clientId);
  }

  @Post('/clients/:clientId/awards/transfer/:toClientId/:howMuch')
  public async transferMiles(
    @Param('clientId') clientId: string,
    @Param('toClientId') toClientId: string,
    @Param('howMuch') howMuch: number,
  ): Promise<AwardsAccountDTO> {
    await this.awardsService.transferMiles(clientId, toClientId, howMuch);

    return await this.awardsService.findBy(clientId);
  }

  @Get('/clients/:clientId/awards')
  public async findBy(
    @Param('clientId') clientId: string,
  ): Promise<AwardsAccountDTO> {
    return await this.awardsService.findBy(clientId);
  }
}
