import { Injectable } from '@nestjs/common';
import { Auction, Prisma } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuctionService {
    constructor(private prismaService: PrismaService) { }


    async create(userId: string, data: Prisma.AuctionCreateInput): Promise<Auction> {
        return await this.prismaService.auction.create({
            data: {
                ...data,
                author: {
                    connect: { id: userId }
                }
            }
        })
    }

    async auctions(): Promise<Auction[]> {
        return await this.prismaService.auction.findMany({
            orderBy: {
                end_date: "desc"
            }
        })
    }

    async findOne(auction_id: string): Promise<Auction | null> {
        return await this.prismaService.auction.findUnique({
            where: {
                id: auction_id
            }
        })
    }

    async update(userId: string, auctionId: string, data: Prisma.AuctionUpdateInput) {
        return await this.prismaService.auction.update({
            where: {
                id: auctionId,
                authorId: userId
            },
            data: {
                ...data
            },
        })
    }

    async updateAuctionImage(userId: string, auctionId: string, image: string): Promise<Auction> {
        const auction = await this.findOne(auctionId)
        return this.update(userId,auctionId ,{ ...auction, image })
    }



}
