import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { compareHash } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from 'generated/prisma';
import { hash } from 'src/utils/bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly prismaService: PrismaService, private jwtService: JwtService) { }

    async validateUser(email: string, pass: string): Promise<User> {
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            throw new BadRequestException('Cannot find user with that email')
        }
        if (!(await compareHash(pass, user.password))) {
            throw new BadRequestException('Cannot find user with that password')
        }
        return user
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }




    async register(registerUserDto: Prisma.UserCreateInput) {
        const {email,name,surname} = registerUserDto
        const hashedPassword = await hash(registerUserDto.password)
        return this.usersService.create({
            email,
            name,
            surname,
            password: hashedPassword
        })

    }

    // async status(user:User):Promise<User>{

    // }

    // src/auth/auth.service.ts
    async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<void> {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        const isMatch = await compareHash(dto.currentPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Current password is incorrect');
        }

        const newHashedPassword = await hash(dto.newPassword);
        await this.usersService.update(userId, {
            password: newHashedPassword,
        });
    }



    async generateJwt(user: User): Promise<string> {
        return this.jwtService.sign(user)
    }
}
