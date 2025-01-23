import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
export declare class LocationsService {
    private readonly locationRepository;
    constructor(locationRepository: Repository<Location>);
    create(createLocationDto: CreateLocationDto): string;
    add(location: any): Promise<import("typeorm").InsertResult>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateLocationDto: UpdateLocationDto): string;
    remove(id: number): string;
}
