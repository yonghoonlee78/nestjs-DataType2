import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EthersService } from './ethers/ethers.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Datatype2Module } from './datatype2/datatype2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    Datatype2Module,
  ],
  controllers: [AppController],
  providers: [AppService, EthersService],
  exports: [EthersService],
})
export class AppModule {}
