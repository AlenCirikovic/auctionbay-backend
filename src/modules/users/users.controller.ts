import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from 'generated/prisma';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: Prisma.UserCreateInput){
        return this.usersService.create(createUserDto)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string){
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id:string, @Body() updateProductDto: Prisma.UserUpdateInput){
        return this.usersService.update(id,updateProductDto)
    }

    @Delete(':id')
    remove(@Param('id') id:string){
        return this.usersService.remove(id)
    }

}
