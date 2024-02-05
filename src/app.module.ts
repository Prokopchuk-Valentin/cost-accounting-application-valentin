import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config';
import configuration from './config/configuration';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { CostsModule } from './costs';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    CostsModule,
  ],
})
export class AppModule {}
