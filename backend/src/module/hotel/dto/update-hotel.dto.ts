import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsEmail, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateHotelDto } from './create-hotel.dto';

export class UpdateHotelDto extends OmitType(PartialType(CreateHotelDto), []) {
    @IsOptional()
    @ApiProperty({
        required: false
    })
    name: string;
    
    @IsOptional()
    @ApiProperty({
        required: false
    })
    description: string;
        
    @IsOptional()
    @ApiProperty({
        required: false
    })
    city: string;

    @IsOptional()
    @ApiProperty({
        required: false
    })
    district: string;

    @IsOptional()
    @ApiProperty({
        required: false
    })
    ward: string;

    @IsOptional()
    @ApiProperty({
        required: false
    })
    detailAddress: string;
    
    @IsOptional()
    @ApiProperty({
        required: false
    })
    phone: string;

    @IsOptional()
    @ApiProperty({
        required: false
    })
    @IsEmail()
    email: string;

    @IsOptional()
    @ApiProperty({
        required: false
    })
    @Transform(({ value }) => (value ? parseInt(value, 10) : 6))
    @IsInt()
    star: number;
}
