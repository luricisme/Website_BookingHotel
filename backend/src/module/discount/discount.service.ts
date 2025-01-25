import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
    ) {}

    async getAll(hotelId: number) {
        return await this.discountRepository.find({where: {hotelId}});
    }

    async createDiscount(req: any, createDiscountDto: CreateDiscountDto) {
        const discount = {...createDiscountDto, hotel: req.user.hotel};
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
