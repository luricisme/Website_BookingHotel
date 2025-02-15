import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { generatingRandomCode } from '@/helpers/utils';
import { Request } from 'express';

@Injectable()
export class DiscountService {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
    ) {}

    async getAll(hotelId: number, req: Request) {
        const {
            page = 1,
            limit = 5,
            sortBy = 'id',
            order = 'ASC',
          } = req.query;
        const take = limit as number;
        const skip = ((page as number) - 1) * (limit as number);
        return await this.discountRepository.find({
            where: {hotelId},
            order: {[(sortBy as string).toLowerCase()]: order},
            skip,
            take,
        });
    }

    async createDiscount(req: any, createDiscountDto: CreateDiscountDto) {
        let code = createDiscountDto.code;
        if (code.length < 1) {
            code = generatingRandomCode(10);
        }
        const discount = {code, ...createDiscountDto, hotel: req.user.hotel};
        return await this.discountRepository.save(discount);
    }

    async updateDiscount(id: number, updateDiscountDto: UpdateDiscountDto) {
        try {
            return await this.discountRepository.update({id}, updateDiscountDto);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async deleteDiscount(id: number) {
        try {
            await this.discountRepository.delete({id});
            return "Successfully";
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
