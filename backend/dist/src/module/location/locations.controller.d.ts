import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(createLocationDto: CreateLocationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateLocationDto: UpdateLocationDto): string;
    remove(id: string): string;
}
