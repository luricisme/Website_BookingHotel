import { IsDateString, IsInt, IsEmail, IsOptional, IsString, Min, IsNumber } from "class-validator";
import { Transform } from 'class-transformer';

export class AddInformationDto {
    @IsString()
    note: string;

    @IsNumber()
    @Min(0)
    totalPrice: number;
}
