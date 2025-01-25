import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';


const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPassword = async (plainPassword : string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (plainPassword : string, hashPassord: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashPassord);
    } catch (error) {
        console.log(error);
    }
}

export class ResponseDto<T> {
    constructor(
        public statusCode: number,
        public message: string,
        public data: T
    ) {}
}

export const generatingRandomCode = (length: number) => {
    return uuidv4().split('-').join('').slice(0, length).toUpperCase()
}
