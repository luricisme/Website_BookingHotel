import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsInt, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { Discount } from '../entities/discount.entity';

export class CreateDiscountDto extends OmitType(PartialType(Discount), ['id', 'hotel']) {
    @ApiProperty({
        description: 'Code of the discount.',
        example: 'DISCOUNT13524',
        required: false,
    })
    @IsOptional()
    code: string;

    @ApiProperty({
        description: 'Status of the discount, can be active or inactive.',
        example: 'active',
        required: false,
    })
    @IsOptional()
    @Transform(({value} : {value: string}) => value ? value.toLowerCase() : value)
    status: string;

    @ApiProperty({
        description: 'Type of the discount (e.g., percentage, fixed amount).',
        example: 'percentage',
    })
    @IsNotEmpty()
    type: string;

    @ApiProperty({
        description: 'Discount value (e.g., 10 for 10%).',
        example: 10,
    })
    @IsNotEmpty()
    value: number;

    @ApiProperty({
        description: 'Start date of the discount.',
        example: '2025-01-01T00:00:00.000Z',
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        const date = new Date(value); 
        return isNaN(date.getTime()) ? null : date;
    })
    @IsDate()
    start_at: Date;

    @ApiProperty({
        description: 'End date of the discount.',
        example: '2025-12-31T23:59:59.000Z',
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        const date = new Date(value); 
        return isNaN(date.getTime()) ? null : date;
    })
    @IsDate()
    end_at: Date;

    @ApiProperty({
        description: 'The number of times the discount can be used.',
        example: 10,
    })
    @IsNotEmpty()
    @IsInt()
    num: number;
}
