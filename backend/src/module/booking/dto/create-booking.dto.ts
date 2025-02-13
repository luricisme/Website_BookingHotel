import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, Min } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateBookingDto {
    @ApiProperty({ example: 1, description: 'ID của khách sạn' })
    @IsInt()
    hotelId: number;

    @ApiProperty({ example: 10, description: 'ID của người dùng' })
    @IsInt()
    userId: number;

    @ApiProperty({ example: '2025-06-15T00:00:00.000Z', description: 'Ngày check-in' })
    @IsDateString()
    checkInDate?: string;

    @ApiProperty({ example: '2025-06-20T00:00:00.000Z', description: 'Ngày check-out' })
    @IsDateString()
    checkOutDate?: string;

    @ApiPropertyOptional({ example: 2, description: 'Số lượng phòng loại 2 người' })
    @Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : value))
    @IsInt()
    roomType2?: number;

    @ApiPropertyOptional({ example: 1, description: 'Số lượng phòng loại 4 người' })
    @Transform(({ value }) => (value !== undefined && value !== null ? parseInt(value, 10) : value))
    @IsInt()
    roomType4?: number;

    @ApiProperty({ example: 100, description: 'Giá phòng loại 2 người' })
    @IsNumber()
    @Min(0)
    type2Price: number;

    @ApiProperty({ example: 200, description: 'Giá phòng loại 4 người' })
    @IsNumber()
    @Min(0)
    type4Price: number;

    @ApiProperty({ example: 500, description: 'Tổng tiền đặt phòng' })
    @IsNumber()
    @Min(0)
    sumPrice: number;
}
