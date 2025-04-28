import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }


    async create(createProductDto: Prisma.UserCreateInput) : Promise<User> {
        return this.prismaService.user.create({
            data: createProductDto
        }
        )
    }

    async findOne(id:string){
        return this.prismaService.user.findUnique({
            where:{
                id,
            }
        })
    }


    async update(id:string, updateUserDto: Prisma.UserUpdateInput): Promise<User>{
        const user = await this.findOne(id)
        return this.prismaService.user.update({
            where:{
             id,   
            },
            data:updateUserDto
        })
    }

    async remove(id:string){
        return this.prismaService.user.delete({
            where:{id}
        })
    }


}
