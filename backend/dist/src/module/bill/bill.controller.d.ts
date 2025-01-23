import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
export declare class BillController {
    private readonly billService;
    constructor(billService: BillService);
    create(createBillDto: CreateBillDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateBillDto: UpdateBillDto): string;
    remove(id: string): string;
}
