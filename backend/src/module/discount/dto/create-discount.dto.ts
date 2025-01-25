import { OmitType, PartialType } from "@nestjs/mapped-types";
import { Discount } from "../entities/discount.entity";
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateDiscountDto extends OmitType(PartialType(Discount), [
  'id',
  'hotel'
]) {
    @IsNotEmpty()
    code: string;

    @IsOptional()
    status: string;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    value: number;

    @IsNotEmpty()
    @Transform(({ value }) => {
      const date = new Date(value); 
      return isNaN(date.getTime()) ? null : date;
    })
    @IsDate()
    start_at: Date;

    @IsNotEmpty()
    @Transform(({ value }) => {
      const date = new Date(value); 
      return isNaN(date.getTime()) ? null : date;
    })
    @IsDate()
    end_at: Date;

    @IsNotEmpty()
    @IsInt()
    num: number;
}