import { CreateUserDto } from "./create-user.dto";
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Omit<Partial<CreateUserDto>, "password">>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    dob?: Date;
    cccd?: string;
}
export {};
