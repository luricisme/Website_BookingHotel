import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateDiscountDto } from "./create-discount.dto";
import { IsOptional } from "class-validator";

export class UpdateDiscountDto extends PartialType(OmitType(CreateDiscountDto, [])) {
    @IsOptional()
    code: string;

    @IsOptional()
    status: string;

    @IsOptional()
    type: string;

    @IsOptional()
    value: number;

    @IsOptional()
    start_at: Date;

    @IsOptional()
    end_at: Date;

    @IsOptional()
    num: number;
}