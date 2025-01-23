import { User } from "@/module/user/entities/user.entity";
export declare class Role {
    id: number;
    name: string;
    users: User[];
}
