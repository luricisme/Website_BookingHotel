import { ApiProperty } from "@nestjs/swagger";

export class MonthlyReportResponseDto {
    @ApiProperty({
        example: "2025-02",
        type: String
    })
    month: string;

    @ApiProperty({
        example: 720010,
        type: Number
    })
    revenue: number;
}