import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ResponseDto } from '@/helpers/utils';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Roles } from '@/helpers/decorator/roles';
import { Public } from '@/helpers/decorator/public';

@Controller('discounts')
export class DiscountController {
    constructor(
        private readonly discountService: DiscountService,
    ) {}

    @Get('all/:hotelId')
    @Public()
    async getAllDiscount(@Param('hotelId') hotelId: string) {
        try {
            const discounts = await this.discountService.getAll(+hotelId);
            return new ResponseDto(200, "Successfully", discounts);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }

    @Post('create')
    @Roles('hotelier')
    async createDiscount(@Req() req, @Body() createDiscountDto: CreateDiscountDto) {
        try {
            const discount = await this.discountService.createDiscount(req, createDiscountDto);
            return new ResponseDto(200, "Successfully", discount);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }

    @Patch('update/:id')
    @Roles('hotelier')
    async updateDiscount(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
        try {
            const newDiscount = await this.discountService.updateDiscount(+id, updateDiscountDto);
            return new ResponseDto(200, "Successfully", null);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }

    @Delete('delete/:id')
    @Roles('hotelier')
    async deleteDiscount(@Param('id') id: string) {
        try {
            const message = await this.discountService.deleteDiscount(+id);
            return new ResponseDto(200, message, null);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }
}
