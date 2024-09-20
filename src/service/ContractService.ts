import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ContractAttachmentDTO } from 'src/dto/ContractAttachmentDTO';
import { ContractDTO } from 'src/dto/ContractDTO';
import { Contract, ContractStatus } from 'src/entity/Contract';
import {
  ContractAttachment,
  ContractAttachmentStatus,
} from 'src/entity/ContractAttachment';
import { ContractAttachmentRepository } from 'src/repository/ContractAttachmentRepository';
import { ContractRepository } from 'src/repository/ContractRepository';

@Injectable()
export class ContractService {
  constructor(
    private contractRepository: ContractRepository,
    private contractAttachmentRepository: ContractAttachmentRepository,
  ) {}

  public async createContract(contractDTO: ContractDTO): Promise<Contract> {
    const contract: Contract = new Contract();

    contract.setPartnerName(contractDTO.partnerName);
    const partnerContractsCount: number =
      (await this.contractRepository.findByPartnerName(contractDTO.partnerName))
        .length + 1;
    contract.setSubject(contractDTO.subject);
    contract.setContractNo(
      'C/' + partnerContractsCount + '/' + contractDTO.partnerName,
    );

    return await this.contractRepository.save(contract);
  }

  public async acceptContract(id: string): Promise<void> {
    const contract: Contract = await this.find(id);

    const attachments: ContractAttachment[] =
      await this.contractAttachmentRepository.findByContract(contract);

    if (
      attachments.every(
        (contractAttachment: ContractAttachment) =>
          contractAttachment.getStatus() ===
          ContractAttachmentStatus.ACCEPTED_BY_BOTH_SIDES,
      )
    ) {
      contract.setStatus(ContractStatus.ACCEPTED);

      await this.contractRepository.save(contract);
    } else {
      throw new NotAcceptableException(
        'Not all attachments accepted by both sides',
      );
    }
  }

  public async rejectContract(id: string): Promise<void> {
    const contract: Contract = await this.find(id);
    contract.setStatus(ContractStatus.REJECTED);

    await this.contractRepository.save(contract);
  }

  public async rejectAttachment(attachmentId: string): Promise<void> {
    const contractAttachment: ContractAttachment =
      await this.contractAttachmentRepository.getOne(attachmentId);
    contractAttachment.setStatus(ContractAttachmentStatus.REJECTED);

    await this.contractAttachmentRepository.save(contractAttachment);
  }

  public async acceptAttachment(attachmentId: string): Promise<void> {
    const contractAttachment: ContractAttachment =
      await this.contractAttachmentRepository.getOne(attachmentId);

    if (
      contractAttachment.getStatus() ===
        ContractAttachmentStatus.ACCEPTED_BY_ONE_SIDE ||
      contractAttachment.getStatus() ===
        ContractAttachmentStatus.ACCEPTED_BY_BOTH_SIDES
    ) {
      contractAttachment.setStatus(
        ContractAttachmentStatus.ACCEPTED_BY_BOTH_SIDES,
      );
    } else {
      contractAttachment.setStatus(
        ContractAttachmentStatus.ACCEPTED_BY_ONE_SIDE,
      );
    }

    await this.contractAttachmentRepository.save(contractAttachment);
  }

  public async find(id: string): Promise<Contract> {
    const contract: Contract = await this.contractRepository.getOne(id);

    if (contract === null) {
      throw new NotFoundException('Contract does not exist');
    }

    return contract;
  }

  public async findDto(id: string): Promise<ContractDTO> {
    return new ContractDTO(await this.find(id));
  }

  public async proposeAttachment(
    contractId: string,
    contractAttachmentDTO: ContractAttachmentDTO,
  ): Promise<ContractAttachmentDTO> {
    const contract: Contract = await this.find(contractId);

    const contractAttachment: ContractAttachment = new ContractAttachment();
    contractAttachment.setContract(contract);
    contractAttachment.setData(contractAttachmentDTO.data);
    await this.contractAttachmentRepository.save(contractAttachment);

    contract.getAttachments().push(contractAttachment);
    await this.contractRepository.save(contract);

    return new ContractAttachmentDTO(contractAttachment);
  }

  public async removeAttachment(
    contractId: string,
    attachmentId: string,
  ): Promise<void> {
    //TODO sprawdzenie czy nalezy do kontraktu (JIRA: II-14455)
    await this.contractAttachmentRepository.deleteById(attachmentId);
  }
}
