import { Injectable } from '@nestjs/common';
import { Auction, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuctionService {
    constructor(private prismaService : PrismaService){}
    

    async create(userId: string, data: Prisma.AuctionCreateInput): Promise<Auction>{
        return await this.prismaService.auction.create({
            data:{
                ...data,
                author:{
                    connect:{id:userId}
                }
            }
        })
    }

    async auctions(): Promise<Auction[]>{
        return await this.prismaService.auction.findMany()
    }


    
}
