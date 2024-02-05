import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CostsService } from './costs.service';
import { Cost, CostsSchema } from 'src/schemas/costs.schemas';
import { AuthModule } from 'src/auth';
import { CostsController } from './costs.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cost.name, schema: CostsSchema }]),
    AuthModule,
  ],
  providers: [CostsService],
  controllers: [CostsController],
})
export class CostsModule {}
