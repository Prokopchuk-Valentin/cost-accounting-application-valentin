import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CostsService } from './costs.service';
import { AuthService } from 'src/auth';
import { JWTGuard } from 'src/auth/guards/jwt.guard';
import { CreateCostDto, UpdateCostDto } from './dto';

@Controller('cost')
export class CostsController {
  constructor(
    private readonly costsService: CostsService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JWTGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllCosts(@Req() req, @Res() res) {
    const user = await this.authService.getUserByTokenData(req.token);
    const costs = await this.costsService.findAll(user._id.toString());

    return res.send(costs);
  }

  @UseGuards(JWTGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCost(@Body() createCostDto: CreateCostDto, @Req() req) {
    const user = await this.authService.getUserByTokenData(req.token);

    return await this.costsService.create({
      ...createCostDto,
      userId: user._id.toString(),
    });
  }

  @UseGuards(JWTGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCost(
    @Body() updateCostDto: UpdateCostDto,
    @Param('id') id: string,
  ) {
    return await this.costsService.update(updateCostDto, id);
  }

  @UseGuards(JWTGuard)
  @Delete('deleteAll')
  @HttpCode(HttpStatus.OK)
  async deleteAllCost(@Req() req) {
    const user = await this.authService.getUserByTokenData(req.token);
    return await this.costsService.deleteAll(user._id.toString());
  }

  @UseGuards(JWTGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCost(@Param('id') id: string) {
    return await this.costsService.deleteOne(id);
  }
}
