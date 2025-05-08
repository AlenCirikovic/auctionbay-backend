import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { Auction, Prisma } from 'generated/prisma';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { response } from 'express';

@Controller('auction')
export class AuctionController {
    constructor(private auctionService: AuctionService){}


    @Post('/me/auction')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Req() req: RequestWithUser,@Body() body: Prisma.AuctionCreateInput): Promise<Auction>{
        const user = req.user
        return await this.auctionService.create(user.id,body)

    }


    @Get('auctions')
    @HttpCode(HttpStatus.OK)
    async auctions():Promise<Auction[]>{
        return await this.auctionService.auctions()
    }

}
