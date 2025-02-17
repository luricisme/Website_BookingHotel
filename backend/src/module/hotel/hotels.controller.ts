import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    ParseIntPipe,
    Req,
    UseInterceptors,
    BadRequestException,
    UploadedFiles,
} from "@nestjs/common";
import { Public } from "@/helpers/decorator/public";
import { HotelsService } from "./hotels.service";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { UpdateHotelDto } from "./dto/update-hotel.dto";
import { SearchHotelDto } from "./dto/search-hotel.dto";
import { DetailHotelDto } from "./dto/detail-hotel.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Roles } from "@/helpers/decorator/roles";
import { ResponseDto } from "@/helpers/utils";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiSecurity } from "@nestjs/swagger";

@Controller("hotels")
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService) {}

    // USER
    // [GET]: /hotels/getAll
    @Get("getAll")
    @Roles("admin")
    findAll(@Req() req) {
        return this.hotelsService.findAll(req);
    }

    // [GET]: /hotels/recommended-hotel
    @Get("recommended-hotel/:userId")
    @Public()
    async recommendedHotel(@Param("userId") userId: string) {
        return await this.hotelsService.getTopTenRatingHotel(+userId);
    }

    // [GET]: /hotels?city=...&checkInDate=...&checkOutDate=...&roomType2=...&roomType4=...&minPrice=...&maxPrice=...&minRating=...&minStar=...&page=...&perPage=...
    @Get("search/:userId")
    @Public()
    async findAvailableHotels(
        @Param("userId") userId: string,
        @Query() searchHotelDto: SearchHotelDto
    ) {
        return await this.hotelsService.findAvailableHotels(searchHotelDto, +userId);
    }

    // [GET]: /hotels/:id?checkInDate=...&checkOutDate=...&roomType2=...&roomType4=...
    @Get(":id")
    @Public()
    async findOne(@Param("id", ParseIntPipe) id: number, @Query() detailHotelDto: DetailHotelDto) {
        return await this.hotelsService.findOne(id, detailHotelDto);
    }

    // HOTELIER
    // [POST]: /hotels/add/basicInfo/:userId
    @Post("add/basicInfo/:userId")
    @Roles("hotelier")
    async addBasicInfo(@Param("userId") userId: string, @Body() createHotelDto: CreateHotelDto) {
        return await this.hotelsService.addBasicInfo(createHotelDto, userId);
    }

    // [POST]: /hotels/images/upload/:hotelId
    @Post("images/upload/:hotelId")
    @Roles("hotelier")
    @UseInterceptors(
        FilesInterceptor("images", 15, {
            storage: memoryStorage(),
            limits: { fileSize: 2 * 1024 * 1024 },
        })
    )
    async uploadImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Param("hotelId") hotelId: string
    ) {
        console.log(">>> files", files);
        if (!files || files.length === 0) {
            throw new BadRequestException("At least one file is required");
        }
        return await this.hotelsService.uploadImages(files, hotelId);
    }

    // [POST]: /hotels/payment/add/:hotelId
    @Post("payment/add/:hotelId")
    @Roles("hotelier")
    async addPaymentMethod(@Param("hotelId") hotelId: string, @Body() body) {
        return await this.hotelsService.addPaymentMethod(hotelId, body);
    }

    // ADMIN
    @Delete(":id")
    @Roles("admin")
    remove(@Param("id") id: string) {
        return this.hotelsService.remove(+id);
    }

    @Get("admin/dashboard/t/request")
    @Public()
    async totalDashboardRequest() {
        return await this.hotelsService.totalRequest();
    }

    @Get("admin/dashboard/ga/request")
    @Public()
    async getDashboardRequest() {
        return await this.hotelsService.getRequest();
    }

    @Get("updateHotelStatus/:hotelId/:status")
    @Roles("admin")
    async updateHotelStatus(@Param("hotelId") hotelId: number, @Param("status") status: string) {
        return await this.hotelsService.updateHotelStatus(hotelId, status);
    }

    @Patch(':id')
    @Roles('hotelier')
    @ApiOperation({ summary: 'Update basic info hotel' })
    @ApiResponse({
        status: 200,
        description: 'Successfully retrieved discounts.',
        type: ResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error.',
    })
    async update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
        const hotel = await this.hotelsService.update(+id, updateHotelDto);
        return new ResponseDto(200, 'Update hotel successfully', hotel);
    }
}
