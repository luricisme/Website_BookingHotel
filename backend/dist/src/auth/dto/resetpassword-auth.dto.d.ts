import { CreateAuthDto } from './create-auth.dto';
declare const ResetpassAuthDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAuthDto>>;
export declare class ResetpassAuthDto extends ResetpassAuthDto_base {
    email: string;
    codeId: string;
    newPassword: string;
}
export {};
