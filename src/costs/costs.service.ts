import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cost, CostsDocument } from 'src/schemas/costs.schemas';
import { CreateCostDto, UpdateCostDto } from './dto';

@Injectable()
export class CostsService {
  constructor(
    @InjectModel(Cost.name) private costsModel: Model<CostsDocument>,
  ) {}

  async findAll(userId): Promise<Cost[]> {
    return this.costsModel.find({ userId });
  }

  async findOne(id: string): Promise<Cost> {
    return this.costsModel.findOne({ _id: id });
  }

  async create(createCostDto: CreateCostDto): Promise<Cost> {
    const createdCost = new this.costsModel(createCostDto);
    return createdCost.save();
  }

  async update(updateCostDto: UpdateCostDto, id: string): Promise<Cost> {
    await this.costsModel.updateOne(
      { _id: id },
      { $set: { ...updateCostDto } },
    );
    return this.findOne(id);
  }

  async deleteOne(_id: string): Promise<void> {
    await this.costsModel.deleteOne({ _id });
  }

  async deleteAll(userId: string): Promise<void> {
    await this.costsModel.deleteMany({ userId });
  }
}
