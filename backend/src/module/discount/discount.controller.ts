import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ResponseDto } from '@/helpers/utils';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Roles } from '@/helpers/decorator/roles';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('discounts')
export class DiscountController {
    constructor(
        private readonly discountService: DiscountService,
    ) {}

    @Get('all/:hotelId')
    @Public()
    @ApiOperation({ summary: 'Get all discounts for a hotel' })
    @ApiParam({ name: 'hotelId', type: String, description: 'The hotel ID' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved discounts.',
        type: ResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async getAllDiscount(@Param('hotelId') hotelId: string, @Req() req: Request) {
        try {
            const discounts = await this.discountService.getAll(+hotelId, req);
            return new ResponseDto(200, "Successfully", discounts);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }

    @Post('create')
    @Roles('hotelier')
    @ApiOperation({ summary: 'Create a new discount' })
    @ApiResponse({
        status: 200,
        description: 'Successfully created the discount.',
        type: ResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    @ApiBody({ type: CreateDiscountDto })
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
    @ApiOperation({ summary: 'Update an existing discount' })
    @ApiParam({ name: 'id', type: String, description: 'The ID of the discount to update' })
    @ApiResponse({
        status: 200,
        description: 'Successfully updated the discount.',
        type: ResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
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
    @ApiOperation({ summary: 'Delete a discount' })
    @ApiParam({ name: 'id', type: String, description: 'The ID of the discount to delete' })
    @ApiResponse({
        status: 200,
        description: 'Successfully deleted the discount.',
        type: ResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async deleteDiscount(@Param('id') id: string) {
        try {
            const message = await this.discountService.deleteDiscount(+id);
            return new ResponseDto(200, message, null);
        } catch (error) {
            return new ResponseDto(500, error.message, null);
        }
    }
}
