import { Module } from '@nestjs/common';
import { Datatype2Service } from './service/datatype2.service';
import { Datatype2Controller } from './controller/datatype2.controller';
import { EthersService } from '../ethers/ethers.service';

@Module({
  controllers: [Datatype2Controller],
  providers: [Datatype2Service, EthersService],
})
export class Datatype2Module {}
