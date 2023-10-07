import { Injectable } from '@nestjs/common';
import { ClaimAttachment } from 'src/entity/ClaimAttachment';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClaimAttachmentRepository extends Repository<ClaimAttachment> {
  constructor(private dataSource: DataSource) {
    super(ClaimAttachment, dataSource.createEntityManager());
  }
}
