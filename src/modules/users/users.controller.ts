import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: Prisma.UserCreateInput) {
        return this.usersService.create(createUserDto)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
    @HttpCode(HttpStatus.CREATED)
    async upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: string): Promise<User> {
        const filename = file?.filename
        if (!filename) throw new BadRequestException('File must be a png, jpg or jpeg')
        const imagesFolderPath = join(process.cwd(), 'files')
        const fullImagePath = join(imagesFolderPath + '/' + file.filename)
        if (await isFileExtensionSafe(fullImagePath)) {
            return this.usersService.updateUserImageId(id, filename)
        }
        removeFile(fullImagePath)
        throw new BadRequestException('File content does not match extension!')
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: Prisma.UserUpdateInput) {
        return this.usersService.update(id, updateProductDto)
    }
    

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }

}
