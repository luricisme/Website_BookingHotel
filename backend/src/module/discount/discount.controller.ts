import { Body, Controller, Delete, Param, Patch, Post, Req } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ResponseDto } from '@/helpers/utils';

@Controller('discounts')
export class DiscountController {
    constructor(
        private readonly discountService: DiscountService,
    ) {}

    @Post('create')
    async createDiscount(@Req() req, @Body() createDiscountDto: CreateDiscountDto) {
        try {
            const discount = await this.discountService.createDiscount(req, createDiscountDto);
            return new ResponseDto(200, "Successfully", discount);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }

    @Patch('update/:id')
    async updateDiscount(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
        try {
            const newDiscount = await this.discountService.updateDiscount(+id, updateDiscountDtp);
            return new ResponseDto(200, "Successfully", newDiscount);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }

    @Delete('delete/:id')
    async deleteDiscount(@Param('id') id: string) {
        try {
            const message = await this.discountService.deleteDiscount(+id);
            return new ResponseDto(200, message, null);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
        
    }
}
