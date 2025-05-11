import { Injectable } from '@nestjs/common';
import { connect } from 'http2';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BidService {
    constructor(private prismaService: PrismaService){}


    async placeBid(auctionId: string, userId: string, offer: number) : Promise<any> {
        return await this.prismaService.bid.create({
            data:{
                auction:{
                    connect:{id:auctionId}
                },
                author:{
                    connect:{id:userId}
                },
                offer
            
            }
        })
    }
}
