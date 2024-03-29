import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Address } from './entity/Address';
import { Invoice } from './entity/Invoice';
import { CarType } from './entity/CarType';
import { DriverFee } from './entity/DriverFee';
import { DriverPosition } from './entity/DriverPosition';
import { DriverSession } from './entity/DriverSession';
import { Driver } from './entity/Driver';
import { DriverAttribute } from './entity/DriverAttribute';
import { AwardsAccount } from './entity/AwardsAccount';
import { Client } from './entity/Client';
import { Claim } from './entity/Claim';
import { ClaimAttachment } from './entity/ClaimAttachment';
import { ContractAttachment } from './entity/ContractAttachment';
import { Contract } from './entity/Contract';
import { Transit } from './entity/Transit';
import { AwardedMiles } from './entity/AwardedMiles';
import { TestController } from './controller/TestController';
import { AddressRepository } from './repository/AddressRepository';
import { AwardedMilesRepository } from './repository/AwardedMilesRepository';
import { AwardsAccountRepository } from './repository/AwardsAccountRepository';
import { CarTypeRepository } from './repository/CarTypeRepository';
import { ClaimAttachmentRepository } from './repository/ClaimAttachmentRepository';
import { ClaimRepository } from './repository/ClaimRepository';
import { ClientRepository } from './repository/ClientRepository';
import { ContractAttachmentRepository } from './repository/ContractAttachmentRepository';
import { ContractRepository } from './repository/ContractRepository';
import { DriverAttributeRepository } from './repository/DriverAttributeRepository';
import { DriverFeeRepository } from './repository/DriverFeeRepository';
import { DriverPositionRepository } from './repository/DriverPositionRepository';
import { DriverSessionRepository } from './repository/DriverSessionRepository';
import { InvoiceRepository } from './repository/InvoiceRepository';
import { TransitRepository } from './repository/TransitRepository';
import { AwardsService } from './service/AwardsService';
import { AppProperties } from './config/AppProperties';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT, 10)
        : 3456,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      entities: [
        Address,
        Invoice,
        CarType,
        DriverFee,
        DriverPosition,
        DriverSession,
        DriverAttribute,
        Driver,
        AwardsAccount,
        Client,
        Claim,
        ClaimAttachment,
        ContractAttachment,
        Contract,
        AwardedMiles,
        Transit,
      ],
    }),
  ],
  controllers: [TestController],
  providers: [
    // repositories
    AddressRepository,
    AwardedMilesRepository,
    AwardsAccountRepository,
    CarTypeRepository,
    ClaimAttachmentRepository,
    ClaimRepository,
    ClientRepository,
    ContractAttachmentRepository,
    ContractRepository,
    DriverAttributeRepository,
    DriverFeeRepository,
    DriverPositionRepository,
    DriverSessionRepository,
    InvoiceRepository,
    TransitRepository,

    // services
    AwardsService,

    // config
    AppProperties,
  ],
})
export class AppModule {}
