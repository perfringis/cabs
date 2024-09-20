import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ContractAttachmentDTO } from 'src/dto/ContractAttachmentDTO';
import { ContractDTO } from 'src/dto/ContractDTO';
import { Contract } from 'src/entity/Contract';
import { ContractService } from 'src/service/ContractService';

@Controller()
export class ContractController {
  constructor(private contractService: ContractService) {}

  @Post('/contracts')
  public async create(@Body() contractDTO: ContractDTO): Promise<ContractDTO> {
    const created: Contract = await this.contractService.createContract(
      contractDTO,
    );

    return new ContractDTO(created);
  }

  @Get('/contracts/:id')
  public async find(@Param('id') id: string): Promise<ContractDTO> {
    const contract: ContractDTO = await this.contractService.findDto(id);

    return contract;
  }

  @Post('/contracts/:id/attachment')
  public async proposeAttachment(
    @Param('id') id: string,
    @Body() contractAttachmentDTO: ContractAttachmentDTO,
  ): Promise<ContractAttachmentDTO> {
    const dto: ContractAttachmentDTO =
      await this.contractService.proposeAttachment(id, contractAttachmentDTO);

    return dto;
  }

  @Post('/contracts/:contractId/attachment/:attachmentId/reject')
  public async rejectAttachment(
    @Param('contractId') contractId: string,
    @Param('attachmentId') attachmentId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.contractService.rejectAttachment(attachmentId);

    response.status(HttpStatus.OK).send();
  }

  @Post('/contracts/:contractId/attachment/:attachmentId/accept')
  public async acceptAttachment(
    @Param('contractId') contractId: string,
    @Param('attachmentId') attachmentId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.contractService.acceptAttachment(attachmentId);

    response.status(HttpStatus.OK).send();
  }

  @Delete('/contracts/:contractId/attachment/:attachmentId')
  public async removeAttachment(
    @Param('contractId') contractId: string,
    @Param('attachmentId') attachmentId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.contractService.removeAttachment(contractId, attachmentId);

    response.status(HttpStatus.OK).send();
  }

  @Post('/contracts/:id/accept')
  public async acceptContract(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.contractService.acceptContract(id);

    response.status(HttpStatus.OK).send();
  }

  @Post('/contracts/:id/reject')
  public async rejectContract(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    await this.contractService.rejectContract(id);

    response.status(HttpStatus.OK).send();
  }
}
