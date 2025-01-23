import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
export declare class BillService {
    create(createBillDto: CreateBillDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateBillDto: UpdateBillDto): string;
    remove(id: number): string;
}
