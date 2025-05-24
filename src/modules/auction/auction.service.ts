import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    async findMany(userId: string): Promise<Auction[]> { // myauctions
        return await this.prismaService.auction.findMany({
            where: {
                author: {
                    id: userId
                }
            },
            include: {
                author: true,
                bids: true
            }
        })
    }


    async findBidOnAuctions(userId: string): Promise<Auction[]> { // use this for bidding page in frontend
        const now = new Date();

        const auctions = await this.prismaService.auction.findMany({
            where: {
                end_date: {
                    gt: now, 
                },
                bids: {
                    some: {
                        authorId: userId, 
                    },
                },
            },
            include: {
                bids: true,
                author: true,
            },
        });

        return auctions;
    }



    async findWonAuctions(userId: string): Promise<Auction[]> { // use this of won page in frontend
        const now = new Date();

        const endedAuctions = await this.prismaService.auction.findMany({
            where: {
                end_date: {
                    lte: now,
                },
                bids: {
                    some: {},
                }
            },
            include: {
                bids: true,
                author: true,
            },
        });

        // Filter: user must have the highest bid
        const wonAuctions = endedAuctions.filter(auction => {
            const highestBid = auction.bids.reduce((max, bid) => bid.offer > max.offer ? bid : max, auction.bids[0]);
            return highestBid.authorId === userId;
        });

        return wonAuctions;
    }


    async findAuctionWithBids(auctionId: string): Promise<Auction> {
        const auction = await this.prismaService.auction.findUnique({
            where: { id: auctionId },
            include: {
                bids: {
                    orderBy: { offer: 'desc' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                surname: true,
                                avatar: true,
                            },
                        },
                    },
                },
                author: true,
            },
        });

        if (!auction) {
            throw new NotFoundException(`Auction with ID ${auctionId} not found`);
        }

        return auction;
    }


    async findAuctionsWithBids(): Promise<Auction[]> {
        return await this.prismaService.auction.findMany({
            include: {
                bids: {
                    orderBy: { offer: 'desc' },
                },
                author: true
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
        return this.update(userId, auctionId, { ...auction, image })
    }


    async getOtherUsersAuctions(currentUserId: string) {
        return this.prismaService.auction.findMany({
            where: {
                NOT: {
                    authorId: currentUserId,
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        surname: true,
                        avatar: true,
                    },
                },
                bids: true,
            },
            orderBy: {
                published_on: 'desc',
            },
        });
    }

  async forceDelete(userId: string, auctionId: string): Promise<{ message: string }> {
        // First, check if the auction exists and belongs to the user
        const auction = await this.prismaService.auction.findUnique({
            where: { id: auctionId }
        });

        if (!auction) {
            throw new NotFoundException(`Auction with ID ${auctionId} not found`);
        }

        if (auction.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own auctions');
        }

        // Delete all bids first, then delete the auction
        await this.prismaService.bid.deleteMany({
            where: { auctionId: auctionId }
        });

        await this.prismaService.auction.delete({
            where: { id: auctionId }
        });

        return { message: 'Auction and all related bids deleted successfully' };
    }

}
