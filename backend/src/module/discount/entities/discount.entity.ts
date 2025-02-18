import { Hotel } from "@/module/hotel/entities/hotel.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "discounts"})
export class Discount {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column({default: "active"})
    status: string;

    @Column()
    type: string;

    @Column()
    value: number;

    @Column({default: 0, name: "minAmount"})
    minAmount: number;

    @Column()
    @Column({default: Date.now()})
    start_at: Date;

    @Column({default: Date.now()})
    end_at: Date;

    @Column()
    num: number;

    @ManyToOne(() => Hotel, (hotel) => hotel.discounts, {cascade: true})
    @JoinColumn({name: "hotelId"})
    hotel: Hotel;

    @Column({name: "hotelId"})
    hotelId: number;
}