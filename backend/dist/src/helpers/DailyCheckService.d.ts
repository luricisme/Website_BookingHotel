import { RoomTypeService } from "@/module/room_type/room_type.service";
export declare class DailyCheckService {
    private readonly roomtypeService;
    constructor(roomtypeService: RoomTypeService);
    setWeekendPrice(): Promise<void>;
    resetWeekendPrice(): Promise<void>;
}
