import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { compareHash } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from 'generated/prisma';
import { hash } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private readonly prismaService: PrismaService, private jwtService: JwtService) { }

    async validateUser(email: string, pass: string) : Promise<User> {
        const user = await this.usersService.findByEmail(email)
        if(!user){
            throw new BadRequestException('Cannot find user with that email')
        }
        if(!(await compareHash(pass,user.password))){
            throw new BadRequestException('Cannot find user with that password')
        }
        return user
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id };
        return this.jwtService.sign(payload); 
      }
      

    
    async register(registerUserDto: Prisma.UserCreateInput){
        const hashedPassword = await hash(registerUserDto.password)
        return this.usersService.create({
            ...registerUserDto,
            password: hashedPassword
        })

    }

    // async status(user:User):Promise<User>{
        
    // }


    async generateJwt(user: User) : Promise<string>{
        return this.jwtService.sign(user)
    }
}
