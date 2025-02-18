import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateDiscountDto } from './create-discount.dto';

export class UpdateDiscountDto extends PartialType(OmitType(CreateDiscountDto, [])) {
    @ApiProperty({
        description: 'Discount code (optional for update).',
        example: 'DISCOUNT2025',
        required: false,
    })
    @IsOptional()
    code: string;

    @ApiProperty({
        description: 'Status of the discount (optional for update).',
        example: 'active',
        required: false, 
    })
    @IsOptional()
    status: string;

    @ApiProperty({
        description: 'Type of the discount (optional for update).',
        example: 'percentage',
        required: false,
    })
    @IsOptional()
    type: string;

    @ApiProperty({
        description: 'Discount value (optional for update).',
        example: 10,
        required: false, 
    })
    @IsOptional()
    value: number;

    @ApiProperty({
        description: 'Min value for discount',
        example: 100000,
        required: false
    })
    @IsOptional()
    minAmount: number;

    @ApiProperty({
        description: 'Start date of the discount (optional for update).',
        example: '2025-01-01T00:00:00.000Z', 
        required: false, 
    })
    @IsOptional()
    start_at: Date;

    @ApiProperty({
        description: 'End date of the discount (optional for update).',
        example: '2025-12-31T23:59:59.000Z',
        required: false,  
    })
    @IsOptional()
    end_at: Date;

    @ApiProperty({
        description: 'Number of times the discount can be used (optional for update).',
        example: 10,
        required: false,
    })
    @IsOptional()
    num: number;
}
