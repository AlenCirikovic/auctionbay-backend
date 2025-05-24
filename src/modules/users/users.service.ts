import { BadRequestException, Injectable } from '@nestjs/common';
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

    async findOne(id: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            }
        })
        if (!user) {
            throw new BadRequestException('No user found')
        }
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


   async update(userId: string, updateUserDto: Prisma.UserUpdateInput): Promise<User> {
        const user = await this.findOne(userId);
        
        const { name, surname, email, avatar } = updateUserDto;
        
        const updateData: Partial<Prisma.UserUpdateInput> = {};
        
        if (name !== undefined) updateData.name = name;
        if (surname !== undefined) updateData.surname = surname;
        if (email !== undefined) updateData.email = email;
        if (avatar !== undefined) updateData.avatar = avatar;

        return await this.prismaService.user.update({
            where: { id: userId },
            data: updateData
        });
    }

    async updateUserImageId(id: string, avatar: string): Promise<User> {
        const user = await this.findOne(id)
        return this.update(user.id, { avatar })
    }


    async remove(id: string) {
        return this.prismaService.user.delete({
            where: { id }
        })
    }


}
