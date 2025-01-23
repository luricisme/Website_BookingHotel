"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const utils_1 = require("../../helpers/utils");
const uuid_1 = require("uuid");
const moment = require("moment");
const minio_service_1 = require("../../minio/minio.service");
let UserService = class UserService {
    constructor(usersRepository, dataSource, minioService) {
        this.usersRepository = usersRepository;
        this.dataSource = dataSource;
        this.minioService = minioService;
    }
    async findAll(role, req) {
        const { page = 1, limit = 5, sortBy = 'id', order = 'ASC', searchTerm } = req.query;
        const queryBuilder = this.usersRepository.createQueryBuilder('user')
            .select([
            'user.id',
            'user.name',
            'user.email',
            'user.phone',
            'user.dob',
            'user.cccd'
        ])
            .innerJoin('users_roles', 'ur', 'ur."userId" = user.id')
            .innerJoin('role', 'r', 'ur."roleId" = r.id')
            .where('r.name = :role', { role });
        queryBuilder.orderBy(`user.${sortBy}`, order === 'ASC' ? 'ASC' : 'DESC');
        const [users, total] = await queryBuilder
            .take(+limit)
            .skip((+page - 1) * +limit)
            .getManyAndCount();
        return {
            page: page,
            per_page: limit,
            total,
            total_pages: Math.ceil(total / +limit),
            users
        };
    }
    findOne(id) {
        return this.usersRepository.findOneBy({ id });
    }
    async findAllFav(req) {
        const { page = 1, limit = 5, sortBy = 'name', order = 'ASC', userId = 1, } = req.query;
        const queryRunner = this.dataSource.createQueryRunner();
        const take = limit;
        const skip = (page - 1) * limit;
        const allFavHotel = await queryRunner.query(`
      SELECT count(*)
      FROM hotel
      WHERE id IN (
        SELECT "hotelId"
        FROM "user_favouriteHotel"
        WHERE "userId" = ${userId}
      )
    `);
        const allPage = parseInt(allFavHotel[0].count);
        let allFavHotelPaging = await queryRunner.query(`
      SELECT 
        h.*, 
        MIN(rt.price) AS price,
        json_agg(i.url) AS images
      FROM hotel h
      JOIN "user_favouriteHotel" uf ON uf."hotelId" = h.id
      LEFT JOIN room_type rt ON rt."hotelId" = h.id
      LEFT JOIN image i ON i."hotelId" = h.id
      WHERE uf."userId" = $1
      GROUP BY h.id
      ORDER BY ${sortBy} ${order}
      LIMIT $2 OFFSET $3
    `, [userId, take, skip]);
        await queryRunner.release();
        allFavHotelPaging = allFavHotelPaging.map(hotel => ({
            ...hotel,
            isFav: true
        }));
        return {
            status: 200,
            message: 'Successfully',
            data: {
                all_page: Math.ceil(allPage / take),
                total: allPage,
                hotels: allFavHotelPaging,
            },
        };
    }
    async findByEmail(email) {
        return await this.usersRepository.findOne({
            where: {
                email,
            },
        });
    }
    async findById(id) {
        return await this.usersRepository.findOne({
            where: {
                id,
            },
        });
    }
    async isEmailExist(email) {
        let isExist = await this.usersRepository.findBy({ email });
        if (isExist.length !== 0) {
            return true;
        }
        return false;
    }
    async create(createUserDto) {
        const { name, email, password, phone } = createUserDto;
        const isEmailExist = await this.isEmailExist(email);
        if (isEmailExist) {
            throw new common_1.BadRequestException('email has existed');
        }
        const hashPassord = await (0, utils_1.hashPassword)(password);
        const user = this.usersRepository.save({
            name,
            email,
            password: hashPassord,
            phone,
        });
        return (await user).id;
    }
    async createUsers(createUserDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            createUserDto.forEach(async (u) => {
                await queryRunner.manager.save(u);
            });
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Transaction error!');
        }
        finally {
            await queryRunner.release();
        }
    }
    async registerUser(createAuthDto, role) {
        const { name, dob, cccd, email, password, phone } = createAuthDto;
        const isEmailExist = await this.isEmailExist(email);
        if (isEmailExist) {
            throw new common_1.BadRequestException('email has existed');
        }
        const hashPassord = await (0, utils_1.hashPassword)(password);
        const user = {
            name,
            dob,
            cccd,
            email,
            password: hashPassord,
            phone,
            codeId: (0, uuid_1.v4)(),
            codeExpired: moment().add(30, 'minute'),
        };
        const userSaved = await this.usersRepository.save(user);
        await this.setRole(userSaved.id, role);
        return user;
    }
    async setupResetPassword(email) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Email has not existed!');
        }
        user.codeId = (0, uuid_1.v4)();
        user.codeExpired = moment().add(5, 'minute').toDate();
        await this.updateUser(user);
        return user;
    }
    async resetPassword(resetInfo) {
        const user = await this.findByEmail(resetInfo.email);
        if (!user) {
            throw new common_1.BadRequestException('Email has not existed!');
        }
        if (user.codeId === resetInfo.codeId) {
            if (moment().isBefore(user.codeExpired)) {
                user.password = await (0, utils_1.hashPassword)(resetInfo.newPassword);
                await this.updateUser(user);
                return 'Reset password successfully!';
            }
            else {
                throw new common_1.BadRequestException('The reset code has expired!');
            }
        }
        else {
            throw new common_1.BadRequestException('Invalid reset code!');
        }
    }
    async update(updateUserDto) {
        return await this.usersRepository.update({
            id: updateUserDto.id,
        }, updateUserDto);
    }
    async updateUser(user) {
        return await this.usersRepository.update({
            id: user.id,
        }, user);
    }
    async uploadAvatar(file, email) {
        const bucketName = 'bookastay';
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not existed');
        }
        const fileName = user.name.split(' ').pop() + '.' + file.originalname.split('.').pop();
        await this.minioService.uploadFile(bucketName, `user_avatar/${fileName}`, file.buffer);
        await this.usersRepository.update({
            id: user.id,
        }, {
            avatar: fileName,
        });
    }
    async getAvatarUrl(email) {
        const user = await this.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not existed');
        }
        const objectName = `user_avatar/${user.avatar}`;
        try {
            const url = await this.minioService.getPresignedUrl(objectName);
            return { url };
        }
        catch (error) {
            return { message: 'Failed to retrieve image URL', error };
        }
    }
    async remove(id) {
        if ((await this.usersRepository.findBy({ id })).length === 0) {
            throw new common_1.BadRequestException(`user with id = ${id} not existed`);
        }
        const res = await this.usersRepository.delete(id);
        if (res.affected > 0) {
            return {
                status: 200,
                message: "Delete user successfully"
            };
        }
    }
    async setRole(userId, role) {
        const queryRunner = this.dataSource.createQueryRunner();
        const roleId = await queryRunner.manager.query(`SELECT id FROM role WHERE name = '${role}'`);
        await queryRunner.manager.query(`INSERT INTO users_roles("userId", "roleId") VALUES(${userId}, ${roleId[0].id})`);
        await queryRunner.release();
    }
    async getRole(userId) {
        const queryRunner = this.dataSource.createQueryRunner();
        const role = await queryRunner.manager.query(`
      SELECT r.name
      FROM (
            SELECT *
            FROM users_roles
            WHERE "userId" = ${userId}
          ) ur JOIN role r ON ur."roleId" = r.id
    `);
        await queryRunner.release();
        return role[0].name;
    }
    async addFav(req) {
        const { userId, hotelId } = req.query;
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.startTransaction();
            const isExisted = await queryRunner.manager.query(`
        SELECT *
        FROM "user_favouriteHotel"
        WHERE "userId" = $1 AND "hotelId" = $2
      `, [userId, hotelId]);
            if (isExisted.length > 0) {
                throw new common_1.BadRequestException('Fav hotel has existed');
            }
            const inserted = await queryRunner.manager.query(`
        INSERT INTO "user_favouriteHotel"("userId", "hotelId")
        VALUES ($1, $2)
      `, [userId, hotelId]);
            await queryRunner.commitTransaction();
            return {
                message: 'Successfully',
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deleteFav(req) {
        try {
            const { userId, hotelId } = req.query;
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.query(`
        DELETE FROM "user_favouriteHotel"
        WHERE "userId" = ${userId} AND "hotelId" = ${hotelId}
      `);
            await queryRunner.release();
            return {
                status: 200,
                message: 'Successfully',
            };
        }
        catch (error) {
            console.error('Error deleting favourite hotel:', error);
            throw new common_1.HttpException({
                status_code: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error. Please try again later.',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async dashboardForHotelier(hotelierId) {
        const hotelier = await this.usersRepository.findBy({
            id: hotelierId,
        });
        const dateNow = moment().toLocaleString();
        return hotelier;
    }
    async totalUsers() {
        const roles = ['user'];
        const queryBuilder = this.usersRepository.createQueryBuilder('user')
            .innerJoin('users_roles', 'ur', 'ur."userId" = user.id')
            .innerJoin('role', 'r', 'ur."roleId" = r.id')
            .where('r.name IN (:...roles)', { roles });
        const total = await queryBuilder.getCount();
        return {
            status: 200,
            totalUsers: total
        };
    }
    async totalHotels() {
        const roles = ['hotelier'];
        const queryBuilder = this.usersRepository.createQueryBuilder('user')
            .innerJoin('users_roles', 'ur', 'ur."userId" = user.id')
            .innerJoin('role', 'r', 'ur."roleId" = r.id')
            .where('r.name IN (:...roles)', { roles });
        const total = await queryBuilder.getCount();
        return {
            status: 200,
            totalHotels: total
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        minio_service_1.MinioService])
], UserService);
//# sourceMappingURL=user.service.js.map