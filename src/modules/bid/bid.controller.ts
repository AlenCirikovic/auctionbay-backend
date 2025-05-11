import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Prisma } from 'generated/prisma';
import { RequestWithUser } from 'src/interfaces/auth.interface';

@Controller('bid')
export class BidController {
    constructor(private bidService: BidService){}


    @Post("/auctions/:id/bid")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async placeBid(@Body() body: Prisma.BidCreateInput, @Param('id') auctionId: string, @Req() req: RequestWithUser){
        return this.bidService.placeBid(auctionId,req.user.id,body.offer,)
    }


}
