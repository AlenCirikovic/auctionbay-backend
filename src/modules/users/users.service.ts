import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) { }


    async create(createProductDto: Prisma.UserCreateInput): Promise<User> {
        return await this.prismaService.user.create({
            data: createProductDto
        }
        )
    }

    async findOne(id: string) : Promise<User | null>{
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            }
        })
        return user
    }

    async findByEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: {
                email,
            }
        }
        )
    }


    async update(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<User> {
        return await this.prismaService.user.update({
            where: {
                id,
            },
            data: updateUserDto
        })
    }

    async remove(id: string) {
        return this.prismaService.user.delete({
            where: { id }
        })
    }


}
