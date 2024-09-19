import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClaimDTO } from 'src/dto/ClaimDTO';
import { Claim, ClaimStatus } from 'src/entity/Claim';
import { ClaimService } from 'src/service/ClaimService';

@Controller()
export class ClaimController {
  constructor(private claimService: ClaimService) {}

  @Post('/claims/createDraft')
  public async create(@Body() claimDTO: ClaimDTO): Promise<ClaimDTO> {
    const created: Claim = await this.claimService.create(claimDTO);

    return this.toDto(created);
  }

  @Post('/claims/send')
  public async sendNew(@Body() claimDTO: ClaimDTO): Promise<ClaimDTO> {
    claimDTO.isDraft = false;

    const claim: Claim = await this.claimService.create(claimDTO);
    return this.toDto(claim);
  }

  @Post('/claims/:id/markInProcess')
  public async markAsInProcess(@Param('id') id: string): Promise<ClaimDTO> {
    const claim: Claim = await this.claimService.setStatus(
      ClaimStatus.IN_PROCESS,
      id,
    );

    return this.toDto(claim);
  }

  @Get('/claims/:id')
  public async find(@Param('id') id: string): Promise<ClaimDTO> {
    const claim: Claim = await this.claimService.find(id);

    const dto: ClaimDTO = new ClaimDTO(claim);
    return dto;
  }

  @Post('/claims/:id')
  public async tryToAutomaticallyResolve(
    @Param('id') id: string,
  ): Promise<ClaimDTO> {
    const claim: Claim = await this.claimService.tryToResolveAutomatically(id);

    return this.toDto(claim);
  }

  private toDto(claim: Claim): ClaimDTO {
    return new ClaimDTO(claim);
  }
}
