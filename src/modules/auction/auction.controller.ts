import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { Auction, Prisma } from 'generated/prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';

@Controller('auction')
export class AuctionController {
    constructor(private auctionService: AuctionService) { }


    @Post('/me/auction')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Req() req: RequestWithUser, @Body() body: Prisma.AuctionCreateInput): Promise<Auction> {
        const user = req.user
        return await this.auctionService.create(user.id, body)

    }

    @Get('others')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getOtherUsersAuctions(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        return this.auctionService.getOtherUsersAuctions(userId);
    }

    @Get('auctions')
    @HttpCode(HttpStatus.OK)
    async auctions(): Promise<Auction[]> {
        return await this.auctionService.auctions()
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findMany(@Req() req: RequestWithUser): Promise<Auction[]> {
        console.log(`REQ TOKEN ${req.user}`)
        return await this.auctionService.findMany(req.user.id)
    }

    @Get('won')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findWonAuctions(@Req() req: RequestWithUser): Promise<Auction[]> {
        return await this.auctionService.findWonAuctions(req.user.id);
    }

    @Get('bidded')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async findBidOnAuctions(@Req() req: RequestWithUser): Promise<Auction[]> {
        return await this.auctionService.findBidOnAuctions(req.user.id);
        
    }

    @Delete(':id/force')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async forceDeleteAuction(@Param('id') auctionId: string,@Req() req: RequestWithUser) {
        const userId = req.user.id;
        return await this.auctionService.forceDelete(userId, auctionId);
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async upload(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File, @Param('id') auctionId: string): Promise<Auction> {
        const filename = file?.filename
        if (!filename) throw new BadRequestException('File must be a png, jpg or jpeg')
        const imagesFolderPath = join(process.cwd(), 'files')
        const fullImagePath = join(imagesFolderPath + '/' + file.filename)
        if (await isFileExtensionSafe(fullImagePath)) {
            return this.auctionService.updateAuctionImage(req.user.id, auctionId, filename)
        }
        removeFile(fullImagePath)
        throw new BadRequestException('File content does not match extension!')
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getAuctionWithBids(@Param('id') id: string): Promise<Auction> {
        return await this.auctionService.findAuctionWithBids(id);
    }


    // @Get(':id')
    // @HttpCode(HttpStatus.OK)
    // async auction(@Param('id') id: string): Promise<Auction | null> {
    //     return await this.auctionService.findOne(id)
    // }

    @Patch('/me/auction/:id')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') auctionId: string, @Req() req: RequestWithUser, @Body() body: Prisma.AuctionUpdateInput) {
        return await this.auctionService.update(req.user.id, auctionId, body)
    }

}
