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
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
